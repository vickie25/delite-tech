import { prisma } from "../config/prisma.js";
import { ProductStatus } from "@prisma/client";

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getAdminAnalytics = async (req, res, next) => {
  try {
    const range = String(req.query.range || "30d");
    let from = daysAgo(30);
    if (range === "7d") from = daysAgo(7);
    else if (range === "90d") from = daysAgo(90);
    else if (range === "custom") {
      const start = req.query.from ? new Date(String(req.query.from)) : daysAgo(30);
      const end = req.query.to ? new Date(String(req.query.to)) : new Date();
      from = start;
      const orders = await prisma.order.findMany({
        where: { createdAt: { gte: from, lte: end } },
        include: { items: { include: { product: { include: { category: true } } } } },
      });
      return res.json(buildAnalyticsPayload(orders, from, end));
    }

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: from } },
      include: { items: { include: { product: { include: { category: true } } } } },
    });
    return res.json(buildAnalyticsPayload(orders, from, new Date()));
  } catch (error) {
    return next(error);
  }
};

function buildAnalyticsPayload(orders, from, to) {
  const dayKey = (d) => d.toISOString().slice(0, 10);
  const revenueByDay = new Map();
  const categoryRevenue = new Map();
  const productUnits = new Map();
  const statusCounts = {};
  ORDER_STATUSES.forEach((s) => {
    statusCounts[s] = 0;
  });

  let totalRevenue = 0;
  const customerIds = new Set();

  for (const o of orders) {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    const excluded = o.status === "CANCELLED" || o.status === "REFUNDED";
    if (excluded) continue;
    totalRevenue += Number(o.totalAmount);
    if (o.customerId) customerIds.add(o.customerId);

    const k = dayKey(new Date(o.createdAt));
    revenueByDay.set(k, (revenueByDay.get(k) || 0) + Number(o.totalAmount));

    for (const line of o.items || []) {
      const cat = line.product?.category?.name || "Other";
      const prev = categoryRevenue.get(cat) || 0;
      categoryRevenue.set(cat, prev + line.unitPrice * line.quantity);
      const pid = line.productId;
      productUnits.set(pid, {
        name: line.productName,
        qty: (productUnits.get(pid)?.qty || 0) + line.quantity,
        revenue: (productUnits.get(pid)?.revenue || 0) + line.unitPrice * line.quantity,
      });
    }
  }

  const revenueSeries = [...revenueByDay.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, revenue]) => ({ date, revenue }));

  const categoryPerformance = [...categoryRevenue.entries()].map(([name, revenue]) => ({ name, revenue }));

  const bestSellers = [...productUnits.entries()]
    .map(([productId, v]) => ({ productId, ...v }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 10);

  const orderCount = orders.filter((o) => o.status !== "CANCELLED" && o.status !== "REFUNDED").length;
  const aov = orderCount ? totalRevenue / orderCount : 0;

  return {
    range: { from: from.toISOString(), to: to.toISOString() },
    summary: { totalRevenue, orderCount, aov, uniqueCustomers: customerIds.size },
    revenueByDay: revenueSeries,
    categoryPerformance,
    bestSellers,
    orderStatusBreakdown: statusCounts,
    funnel: {
      placed: orders.length,
      confirmed: orders.filter((o) => ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].includes(o.status)).length,
      shipped: orders.filter((o) => ["SHIPPED", "DELIVERED"].includes(o.status)).length,
      delivered: orders.filter((o) => o.status === "DELIVERED").length,
    },
  };
}

export const getAdminSearch = async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    if (q.length < 2) return res.json({ products: [], orders: [], customers: [] });

    const [products, orders, customers] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { brand: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 8,
        select: { id: true, name: true, brand: true, price: true, imageUrls: true },
      }),
      prisma.order.findMany({
        where: {
          OR: [
            { orderNumber: { contains: q, mode: "insensitive" } },
            { customerName: { contains: q, mode: "insensitive" } },
            { customerEmail: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 8,
        select: { id: true, orderNumber: true, customerName: true, totalAmount: true, status: true },
      }),
      prisma.customer.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 8,
        select: { id: true, name: true, email: true, phone: true },
      }),
    ]);

    return res.json({ products, orders, customers });
  } catch (error) {
    return next(error);
  }
};

export const getAdminOrder = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid order id" });
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true, address: true } },
        items: { include: { product: { select: { id: true, imageUrls: true, slug: true } } } },
      },
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (error) {
    return next(error);
  }
};

export const patchAdminOrder = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid order id" });
    const { status, paymentStatus, internalNotes } = req.body;
    const data = {};
    if (status !== undefined) {
      if (!ORDER_STATUSES.includes(String(status))) {
        return res.status(400).json({ message: "Invalid order status" });
      }
      data.status = String(status);
    }
    if (paymentStatus !== undefined) data.paymentStatus = String(paymentStatus);
    if (internalNotes !== undefined) data.internalNotes = internalNotes === null ? null : String(internalNotes);
    const order = await prisma.order.update({
      where: { id },
      data,
      include: { customer: true, items: { include: { product: true } } },
    });
    return res.json(order);
  } catch (error) {
    return next(error);
  }
};

export const getAdminCustomer = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid customer id" });
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
        isActive: true,
        notes: true,
        orders: {
          orderBy: { createdAt: "desc" },
          include: { items: true },
        },
      },
    });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    const lifetimeValue = customer.orders.reduce((s, o) => s + Number(o.totalAmount), 0);
    return res.json({ ...customer, lifetimeValue });
  } catch (error) {
    return next(error);
  }
};

export const patchAdminCustomer = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid customer id" });
    const { notes, isActive } = req.body;
    const data = {};
    if (notes !== undefined) data.notes = notes === null ? null : String(notes);
    if (isActive !== undefined) data.isActive = Boolean(isActive);
    const customer = await prisma.customer.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, phone: true, notes: true, isActive: true },
    });
    return res.json(customer);
  } catch (error) {
    return next(error);
  }
};

export const getAdminReviews = async (req, res, next) => {
  try {
    const status = String(req.query.status || "").trim();
    const rating = req.query.rating ? Number(req.query.rating) : null;
    const productId = req.query.productId ? Number(req.query.productId) : null;
    const where = {};
    if (status) where.status = status;
    if (rating && Number.isFinite(rating)) where.rating = rating;
    if (productId && Number.isFinite(productId)) where.productId = productId;

    const items = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { product: { select: { id: true, name: true, imageUrls: true } }, customer: { select: { id: true, name: true, email: true } } },
    });
    return res.json({ items });
  } catch (error) {
    return next(error);
  }
};

export const patchAdminReview = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid review id" });
    const { status, adminReply } = req.body;
    const data = {};
    if (status !== undefined) data.status = String(status);
    if (adminReply !== undefined) data.adminReply = adminReply === null ? null : String(adminReply);
    const review = await prisma.review.update({ where: { id }, data });
    return res.json(review);
  } catch (error) {
    return next(error);
  }
};

export const postAdminReview = async (req, res, next) => {
  try {
    const { productId, authorName, authorEmail, rating, body, customerId } = req.body;
    if (!productId || !authorName || !body || rating === undefined) {
      return res.status(400).json({ message: "productId, authorName, body and rating are required" });
    }
    const r = Number(rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) return res.status(400).json({ message: "rating must be 1-5" });
    const review = await prisma.review.create({
      data: {
        productId: Number(productId),
        customerId: customerId != null ? Number(customerId) : null,
        authorName: String(authorName),
        authorEmail: authorEmail ? String(authorEmail) : null,
        rating: r,
        body: String(body),
        status: "PENDING",
      },
    });
    return res.status(201).json(review);
  } catch (error) {
    return next(error);
  }
};

export const getAdminPromotions = async (_req, res, next) => {
  try {
    const items = await prisma.promotion.findMany({ orderBy: { createdAt: "desc" } });
    return res.json({ items });
  } catch (error) {
    return next(error);
  }
};

export const postAdminPromotion = async (req, res, next) => {
  try {
    const {
      name,
      discountType,
      value,
      code,
      usageLimit,
      minOrderValue,
      categoryIds,
      productIds,
      startsAt,
      endsAt,
      active,
      flashProductId,
      flashEndsAt,
    } = req.body;
    if (!name || !discountType || !code) {
      return res.status(400).json({ message: "name, discountType and code are required" });
    }
    const promo = await prisma.promotion.create({
      data: {
        name: String(name),
        discountType: String(discountType),
        value: value != null ? Number(value) : null,
        code: String(code).toUpperCase().replace(/\s+/g, ""),
        usageLimit: usageLimit != null ? Number(usageLimit) : null,
        minOrderValue: minOrderValue != null ? Number(minOrderValue) : null,
        categoryIds: Array.isArray(categoryIds) ? categoryIds : [],
        productIds: Array.isArray(productIds) ? productIds : [],
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
        active: active !== false,
        flashProductId: flashProductId != null ? Number(flashProductId) : null,
        flashEndsAt: flashEndsAt ? new Date(flashEndsAt) : null,
      },
    });
    return res.status(201).json(promo);
  } catch (error) {
    return next(error);
  }
};

export const patchAdminPromotion = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid promotion id" });
    const body = req.body;
    const data = {};
    const keys = [
      "name",
      "discountType",
      "value",
      "code",
      "usageLimit",
      "minOrderValue",
      "categoryIds",
      "productIds",
      "startsAt",
      "endsAt",
      "active",
      "flashProductId",
      "flashEndsAt",
    ];
    for (const k of keys) {
      if (body[k] === undefined) continue;
      if (k === "value" || k === "usageLimit" || k === "minOrderValue" || k === "flashProductId") {
        data[k] = body[k] === null ? null : Number(body[k]);
      } else if (k === "startsAt" || k === "endsAt" || k === "flashEndsAt") {
        data[k] = body[k] ? new Date(body[k]) : null;
      } else if (k === "categoryIds" || k === "productIds") {
        data[k] = Array.isArray(body[k]) ? body[k] : [];
      } else if (k === "active") {
        data[k] = Boolean(body[k]);
      } else if (k === "code") {
        data[k] = String(body[k]).toUpperCase().replace(/\s+/g, "");
      } else {
        data[k] = body[k];
      }
    }
    const promo = await prisma.promotion.update({ where: { id }, data });
    return res.json(promo);
  } catch (error) {
    return next(error);
  }
};

export const deleteAdminPromotion = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid promotion id" });
    await prisma.promotion.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
};

export const getAdminStoreSettings = async (_req, res, next) => {
  try {
    let row = await prisma.storeSetting.findFirst();
    if (!row) {
      row = await prisma.storeSetting.create({
        data: {
          paymentConfig: { mpesa: true, card: true, cod: true, paypal: false },
        },
      });
    }
    return res.json(row);
  } catch (error) {
    return next(error);
  }
};

export const putAdminStoreSettings = async (req, res, next) => {
  try {
    let row = await prisma.storeSetting.findFirst();
    const payload = req.body || {};
    if (!row) {
      row = await prisma.storeSetting.create({
        data: {
          storeName: payload.storeName || "Delight Tech",
          logoUrl: payload.logoUrl || null,
          currency: payload.currency || "KES",
          timezone: payload.timezone || "Africa/Nairobi",
          contactEmail: payload.contactEmail || "info@delighttech.co.ke",
          contactPhone: payload.contactPhone || "+254700000000",
          deliveryFee: Number(payload.deliveryFee) || 0,
          freeShippingThreshold: payload.freeShippingThreshold != null ? Number(payload.freeShippingThreshold) : null,
          shippingZones: payload.shippingZones ?? [],
          taxRate: payload.taxRate != null ? Number(payload.taxRate) : 0,
          taxLabel: payload.taxLabel || "VAT",
          notificationSettings: payload.notificationSettings ?? {},
          paymentConfig: payload.paymentConfig ?? { mpesa: true, card: true, cod: true, paypal: false },
        },
      });
      return res.json(row);
    }
    const data = {};
    const map = [
      "storeName",
      "logoUrl",
      "currency",
      "timezone",
      "contactEmail",
      "contactPhone",
      "deliveryFee",
      "freeShippingThreshold",
      "shippingZones",
      "taxRate",
      "taxLabel",
      "notificationSettings",
      "paymentConfig",
    ];
    for (const k of map) {
      if (payload[k] !== undefined) data[k] = payload[k];
    }
    const updated = await prisma.storeSetting.update({ where: { id: row.id }, data });
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

export const postAdminProductsBulk = async (req, res, next) => {
  try {
    const ids = req.body?.ids;
    const status = req.body?.status;
    const doDelete = req.body?.delete === true;
    if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ message: "ids array required" });
    const idNums = ids.map(Number).filter((n) => Number.isFinite(n));
    if (doDelete) {
      await prisma.product.deleteMany({ where: { id: { in: idNums } } });
      return res.json({ deleted: idNums.length });
    }
    if (status && ["DRAFT", "PUBLISHED"].includes(String(status))) {
      await prisma.product.updateMany({
        where: { id: { in: idNums } },
        data: { status: String(status) === "DRAFT" ? ProductStatus.DRAFT : ProductStatus.PUBLISHED },
      });
      return res.json({ updated: idNums.length });
    }
    return res.status(400).json({ message: "Provide delete: true or status: DRAFT|PUBLISHED" });
  } catch (error) {
    return next(error);
  }
};

export const reorderAdminCategories = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ message: "orderedIds required" });
    await prisma.$transaction(
      orderedIds.map((rawId, index) =>
        prisma.category.update({
          where: { id: Number(rawId) },
          data: { displayOrder: index },
        }),
      ),
    );
    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
};

export const getAdminStockLogs = async (req, res, next) => {
  try {
    const productId = Number(req.query.productId);
    const where = Number.isFinite(productId) ? { productId } : {};
    const items = await prisma.stockLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { product: { select: { id: true, name: true, sku: true } } },
    });
    return res.json({ items });
  } catch (error) {
    return next(error);
  }
};

export const getAdminAdmins = async (_req, res, next) => {
  try {
    const items = await prisma.adminUser.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { id: "asc" },
    });
    return res.json({ items });
  } catch (error) {
    return next(error);
  }
};

export const patchAdminAdminUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });
    const { role, name } = req.body;
    const data = {};
    if (role !== undefined) data.role = String(role);
    if (name !== undefined) data.name = String(name);
    const row = await prisma.adminUser.update({ where: { id }, data, select: { id: true, name: true, email: true, role: true } });
    return res.json(row);
  } catch (error) {
    return next(error);
  }
};
