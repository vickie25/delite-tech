import { ProductStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { sendMail } from "../services/mailer.service.js";
import { loadEmailTemplate, renderTemplate } from "../services/email-template.service.js";

export const getCategories = async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        subcategories: { orderBy: { name: "asc" } },
      },
    });
    return res.json(categories);
  } catch (error) {
    return next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { category, subcategory, brand, page = "1", pageSize = "12" } = req.query;
    const take = Math.max(1, Math.min(50, Number(pageSize)));
    const currentPage = Math.max(1, Number(page));
    const skip = (currentPage - 1) * take;

    const where = {
      status: ProductStatus.PUBLISHED,
      ...(brand ? { brand: String(brand) } : {}),
      ...(category ? { category: { slug: String(category) } } : {}),
      ...(subcategory ? { subcategory: { slug: String(subcategory) } } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, subcategory: true },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      items,
      pagination: {
        page: currentPage,
        pageSize: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    return next(error);
  }
};

const generateOrderNumber = () => {
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `DT-${Date.now()}-${random}`;
};

export const createOrder = async (req, res, next) => {
  try {
    const { customerName, customerEmail, customerPhone, deliveryAddress, paymentMethod, items } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !deliveryAddress || !paymentMethod) {
      return res.status(400).json({ message: "Missing required checkout details" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    const productIds = items.map((item) => Number(item.productId)).filter((id) => Number.isFinite(id));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true },
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({ message: "Some products no longer exist" });
    }

    const productById = new Map(products.map((product) => [product.id, product]));
    const normalizedItems = items.map((item) => {
      const productId = Number(item.productId);
      const product = productById.get(productId);
      const quantity = Math.max(1, Number(item.quantity) || 1);
      return {
        productId,
        productName: product.name,
        unitPrice: Number(product.price),
        quantity,
      };
    });

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const deliveryFee = 0;
    const totalAmount = subtotal + deliveryFee;

    const paymentStatus =
      String(paymentMethod).toLowerCase() === "cod" || String(paymentMethod).toLowerCase().includes("delivery")
        ? "UNPAID"
        : "PAID";

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        paymentMethod,
        paymentStatus,
        subtotal,
        deliveryFee,
        totalAmount,
        status: "PENDING",
        items: {
          create: normalizedItems,
        },
      },
      include: { items: true },
    });

    try {
      const orderTemplate = await loadEmailTemplate("order-confirmation.html");
      const html = renderTemplate(
        orderTemplate.replace("https://delight.tech/account", `${env.frontendBaseUrl}/confirmation`),
        { orderNumber: order.orderNumber },
      );
      await sendMail({
        to: customerEmail,
        subject: `Order confirmation #${order.orderNumber}`,
        text: `Your order ${order.orderNumber} has been received. We'll send shipping updates soon.`,
        html,
      });
    } catch (mailError) {
      console.error("[mailer] Failed to send order confirmation email:", mailError.message);
    }

    return res.status(201).json({
      message: "Order created successfully",
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
      },
    });
  } catch (error) {
    return next(error);
  }
};
