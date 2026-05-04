import { prisma } from "../config/prisma.js";
import { ProductStatus } from "@prisma/client";

const parsePagination = (query) => {
  const page = Math.max(1, Number(query.page || "1"));
  const pageSize = Math.max(1, Math.min(100, Number(query.pageSize || "10")));
  return { page, pageSize, skip: (page - 1) * pageSize };
};

const slugify = (value) => String(value || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

export const getAdminOverview = async (_req, res, next) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const paidLike = { notIn: ["CANCELLED", "REFUNDED"] };

    const [
      customerCount,
      orderCount,
      productCount,
      pendingOrders,
      deliveredOrders,
      revenueAgg,
      revenueToday,
      revenueWeek,
      revenueMonth,
      publishedForStock,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.aggregate({
        where: { status: paidLike },
        _sum: { totalAmount: true },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfToday }, status: paidLike },
        _sum: { totalAmount: true },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfWeek }, status: paidLike },
        _sum: { totalAmount: true },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfMonth }, status: paidLike },
        _sum: { totalAmount: true },
      }),
      prisma.product.findMany({
        where: { status: ProductStatus.PUBLISHED },
        select: { stockQuantity: true, reorderLevel: true },
      }),
    ]);

    let pendingReviewsCount = 0;
    try {
      pendingReviewsCount = await prisma.review.count({ where: { status: "PENDING" } });
    } catch {
      pendingReviewsCount = 0;
    }

    const lowStockAlerts = publishedForStock.filter(
      (p) => p.stockQuantity <= 0 || p.stockQuantity <= (p.reorderLevel ?? 5),
    ).length;

    return res.json({
      totals: {
        customers: customerCount,
        orders: orderCount,
        products: productCount,
        revenue: revenueAgg._sum.totalAmount || 0,
        revenueToday: revenueToday._sum.totalAmount || 0,
        revenueWeek: revenueWeek._sum.totalAmount || 0,
        revenueMonth: revenueMonth._sum.totalAmount || 0,
        lowStockAlerts,
      },
      orderStatus: {
        pending: pendingOrders,
        delivered: deliveredOrders,
      },
      badges: {
        pendingReviews: pendingReviewsCount,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminProducts = async (req, res, next) => {
  try {
    const { page, pageSize, skip } = parsePagination(req.query);
    const search = String(req.query.search || "").trim();
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : null;
    const subcategoryId = req.query.subcategoryId ? Number(req.query.subcategoryId) : null;
    const brand = String(req.query.brand || "").trim();
    const minPrice = req.query.minPrice != null && req.query.minPrice !== "" ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice != null && req.query.maxPrice !== "" ? Number(req.query.maxPrice) : null;
    const stock = String(req.query.stock || "").trim();
    const statusFilter = String(req.query.status || "").trim();

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }
    if (categoryId && Number.isFinite(categoryId)) where.categoryId = categoryId;
    if (subcategoryId && Number.isFinite(subcategoryId)) where.subcategoryId = subcategoryId;
    if (brand) where.brand = { contains: brand, mode: "insensitive" };
    if ((minPrice != null && Number.isFinite(minPrice)) || (maxPrice != null && Number.isFinite(maxPrice))) {
      where.price = {};
      if (minPrice != null && Number.isFinite(minPrice)) where.price.gte = minPrice;
      if (maxPrice != null && Number.isFinite(maxPrice)) where.price.lte = maxPrice;
    }
    if (statusFilter === "DRAFT" || statusFilter === "PUBLISHED") where.status = statusFilter;
    if (stock === "out") where.stockQuantity = { lte: 0 };
    else if (stock === "low") {
      where.AND = [
        ...(where.AND || []),
        { stockQuantity: { gt: 0 } },
        { stockQuantity: { lte: 5 } },
      ];
    } else if (stock === "in") where.stockQuantity = { gt: 5 };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, subcategory: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminOrders = async (req, res, next) => {
  try {
    const { page, pageSize, skip } = parsePagination(req.query);
    const status = String(req.query.status || "").trim();
    const paymentMethod = String(req.query.paymentMethod || "").trim();
    const from = req.query.from ? new Date(String(req.query.from)) : null;
    const to = req.query.to ? new Date(String(req.query.to)) : null;

    const where = {};
    if (status) where.status = status;
    if (paymentMethod) where.paymentMethod = { contains: paymentMethod, mode: "insensitive" };
    if (from && !Number.isNaN(from.getTime())) where.createdAt = { ...(where.createdAt || {}), gte: from };
    if (to && !Number.isNaN(to.getTime())) where.createdAt = { ...(where.createdAt || {}), lte: to };

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: {
            select: { id: true, name: true, email: true, phone: true },
          },
          items: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.order.count({ where }),
    ]);

    return res.json({
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminCustomers = async (req, res, next) => {
  try {
    const { page, pageSize, skip } = parsePagination(req.query);
    const search = String(req.query.search || "").trim();

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          createdAt: true,
          isActive: true,
          notes: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.customer.count({ where }),
    ]);

    const ids = items.map((c) => c.id);
    let spendById = new Map();
    if (ids.length) {
      const sums = await prisma.order.groupBy({
        by: ["customerId"],
        where: { customerId: { in: ids } },
        _sum: { totalAmount: true },
      });
      spendById = new Map(
        sums.filter((s) => s.customerId != null).map((s) => [s.customerId, s._sum.totalAmount || 0]),
      );
    }

    const enriched = items.map((c) => ({
      ...c,
      totalSpent: spendById.get(c.id) || 0,
    }));

    return res.json({
      items: enriched,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    return next(error);
  }
};

// --- Product Management ---

export const createAdminProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      salePrice,
      stockQuantity,
      description,
      categoryId,
      subcategoryId,
      brand,
      imageUrls,
      specifications,
      sku,
      tags,
      status,
      reorderLevel,
    } = req.body;

    if (!name || !brand || categoryId === undefined || subcategoryId === undefined) {
      return res
        .status(400)
        .json({ message: "name, brand, categoryId and subcategoryId are required" });
    }

    const normalizedPrice = Number(price);
    const normalizedStock = Number(stockQuantity);
    if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
      return res.status(400).json({ message: "price must be a valid non-negative number" });
    }
    if (!Number.isFinite(normalizedStock) || normalizedStock < 0) {
      return res.status(400).json({ message: "stockQuantity must be a valid non-negative number" });
    }

    const slug = slugify(name);
    const normalizedSale =
      salePrice === undefined || salePrice === null || salePrice === ""
        ? null
        : Number(salePrice);
    const salePriceValue =
      normalizedSale != null && Number.isFinite(normalizedSale) && normalizedSale >= 0 ? normalizedSale : null;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price: normalizedPrice,
        salePrice: salePriceValue,
        stockQuantity: normalizedStock,
        description: description || "",
        brand,
        imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
        specifications: specifications ?? {},
        sku: sku ? String(sku) : null,
        tags: Array.isArray(tags) ? tags : [],
        status: status === "DRAFT" ? ProductStatus.DRAFT : ProductStatus.PUBLISHED,
        reorderLevel:
          reorderLevel !== undefined && reorderLevel !== null && Number.isFinite(Number(reorderLevel))
            ? Number(reorderLevel)
            : 5,
        categoryId: Number(categoryId),
        subcategoryId: Number(subcategoryId),
      },
      include: { category: true, subcategory: true },
    });
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
};

export const updateAdminProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid product id" });

    const {
      name,
      price,
      salePrice,
      stockQuantity,
      description,
      categoryId,
      subcategoryId,
      brand,
      imageUrls,
      specifications,
      sku,
      tags,
      status,
      reorderLevel,
      stockChangeReason,
    } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Product not found" });

    const updateData = {};
    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = slugify(name);
    }
    if (price !== undefined) {
      const normalizedPrice = Number(price);
      if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
        return res.status(400).json({ message: "price must be a valid non-negative number" });
      }
      updateData.price = normalizedPrice;
    }
    if (salePrice !== undefined) {
      if (salePrice === null || salePrice === "") updateData.salePrice = null;
      else {
        const sp = Number(salePrice);
        if (!Number.isFinite(sp) || sp < 0) return res.status(400).json({ message: "Invalid salePrice" });
        updateData.salePrice = sp;
      }
    }
    if (stockQuantity !== undefined) {
      const normalizedStock = Number(stockQuantity);
      if (!Number.isFinite(normalizedStock) || normalizedStock < 0) {
        return res.status(400).json({ message: "stockQuantity must be a valid non-negative number" });
      }
      updateData.stockQuantity = normalizedStock;
      if (normalizedStock !== existing.stockQuantity) {
        try {
          await prisma.stockLog.create({
            data: {
              productId: id,
              delta: normalizedStock - existing.stockQuantity,
              previousQty: existing.stockQuantity,
              newQty: normalizedStock,
              reason: stockChangeReason ? String(stockChangeReason) : "admin_adjustment",
            },
          });
        } catch (logErr) {
          console.warn("[admin] stock log skipped:", logErr.message);
        }
      }
    }
    if (description !== undefined) updateData.description = description;
    if (brand !== undefined) updateData.brand = brand;
    if (imageUrls !== undefined) updateData.imageUrls = Array.isArray(imageUrls) ? imageUrls : [];
    if (specifications !== undefined) updateData.specifications = specifications ?? {};
    if (categoryId !== undefined) updateData.categoryId = Number(categoryId);
    if (subcategoryId !== undefined) updateData.subcategoryId = Number(subcategoryId);
    if (sku !== undefined) updateData.sku = sku === null || sku === "" ? null : String(sku);
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
    if (status !== undefined) {
      updateData.status = String(status) === "DRAFT" ? ProductStatus.DRAFT : ProductStatus.PUBLISHED;
    }
    if (reorderLevel !== undefined && Number.isFinite(Number(reorderLevel))) {
      updateData.reorderLevel = Number(reorderLevel);
    }

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: updateData,
      include: { category: true, subcategory: true },
    });
    return res.json(product);
  } catch (error) {
    return next(error);
  }
};

export const deleteAdminProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid product id" });
    await prisma.product.delete({ where: { id } });
    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

// --- Category Management ---

export const getAdminCategories = async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          orderBy: { name: "asc" },
          include: { _count: { select: { products: true } } },
        },
        _count: { select: { products: true } },
      },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });
    return res.json(categories);
  } catch (error) {
    return next(error);
  }
};

export const createAdminCategory = async (req, res, next) => {
  try {
    const { name, parentCategoryId, icon, imageUrl } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const slug = slugify(name);
    if (parentCategoryId !== undefined && parentCategoryId !== null) {
      const subcategory = await prisma.subcategory.create({
        data: { name, slug, categoryId: Number(parentCategoryId) },
      });
      return res.status(201).json(subcategory);
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        icon: icon ? String(icon) : null,
        imageUrl: imageUrl ? String(imageUrl) : null,
      },
    });
    return res.status(201).json(category);
  } catch (error) {
    return next(error);
  }
};

export const updateAdminCategory = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid category id" });

    const { name, parentCategoryId, isSubcategory, icon, imageUrl, isActive, displayOrder } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const slug = slugify(name);
    if (isSubcategory) {
      const subcategory = await prisma.subcategory.update({
        where: { id },
        data: {
          name,
          slug,
          ...(parentCategoryId !== undefined ? { categoryId: Number(parentCategoryId) } : {}),
        },
      });
      return res.json(subcategory);
    }

    const data = { name, slug };
    if (icon !== undefined) data.icon = icon === null || icon === "" ? null : String(icon);
    if (imageUrl !== undefined) data.imageUrl = imageUrl === null || imageUrl === "" ? null : String(imageUrl);
    if (isActive !== undefined) data.isActive = Boolean(isActive);
    if (displayOrder !== undefined && Number.isFinite(Number(displayOrder))) data.displayOrder = Number(displayOrder);

    const category = await prisma.category.update({
      where: { id },
      data,
    });
    return res.json(category);
  } catch (error) {
    return next(error);
  }
};

export const deleteAdminCategory = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid category id" });

    const isSubcategory = req.query?.isSubcategory === "true";
    if (isSubcategory) {
      await prisma.subcategory.delete({ where: { id } });
      return res.json({ message: "Subcategory deleted successfully" });
    }

    await prisma.category.delete({ where: { id } });
    return res.json({ message: "Category deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
