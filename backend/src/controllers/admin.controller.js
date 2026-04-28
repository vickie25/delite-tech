import { prisma } from "../config/prisma.js";

const parsePagination = (query) => {
  const page = Math.max(1, Number(query.page || "1"));
  const pageSize = Math.max(1, Math.min(100, Number(query.pageSize || "10")));
  return { page, pageSize, skip: (page - 1) * pageSize };
};

export const getAdminOverview = async (_req, res, next) => {
  try {
    const [customerCount, orderCount, productCount, pendingOrders, deliveredOrders, revenueAgg] =
      await Promise.all([
        prisma.customer.count(),
        prisma.order.count(),
        prisma.product.count(),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.count({ where: { status: "DELIVERED" } }),
        prisma.order.aggregate({ _sum: { totalAmount: true } }),
      ]);

    return res.json({
      totals: {
        customers: customerCount,
        orders: orderCount,
        products: productCount,
        revenue: revenueAgg._sum.totalAmount || 0,
      },
      orderStatus: {
        pending: pendingOrders,
        delivered: deliveredOrders,
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

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { brand: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

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

    const where = status ? { status } : {};

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
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.customer.count({ where }),
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

// --- Product Management ---

export const createAdminProduct = async (req, res, next) => {
  try {
    const { name, price, stockQuantity, description, categoryId, brand, imageUrls, specifications } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        description,
        brand,
        imageUrls,
        specifications,
        categoryId,
      },
    });
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
};

export const updateAdminProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, stockQuantity, description, categoryId, brand, imageUrls, specifications } = req.body;

    const updateData = {
      name,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      description,
      brand,
      imageUrls,
      specifications,
      categoryId,
    };

    if (name) {
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });
    return res.json(product);
  } catch (error) {
    return next(error);
  }
};

export const deleteAdminProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

// --- Category Management ---

export const getAdminCategories = async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { subcategories: true },
      orderBy: { name: "asc" },
    });
    return res.json(categories);
  } catch (error) {
    return next(error);
  }
};

export const createAdminCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const category = await prisma.category.create({
      data: { name, slug },
    });
    return res.status(201).json(category);
  } catch (error) {
    return next(error);
  }
};

export const updateAdminCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const category = await prisma.category.update({
      where: { id },
      data: { name, slug },
    });
    return res.json(category);
  } catch (error) {
    return next(error);
  }
};

export const deleteAdminCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};
