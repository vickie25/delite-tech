import { prisma } from "../config/prisma.js";

const parsePagination = (query) => {
  const page = Math.max(1, Number(query.page || "1"));
  const pageSize = Math.max(1, Math.min(100, Number(query.pageSize || "10")));
  return { page, pageSize, skip: (page - 1) * pageSize };
};

const slugify = (value) => String(value || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

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
    const {
      name,
      price,
      stockQuantity,
      description,
      categoryId,
      subcategoryId,
      brand,
      imageUrls,
      specifications,
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

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price: normalizedPrice,
        stockQuantity: normalizedStock,
        description: description || "",
        brand,
        imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
        specifications: specifications ?? {},
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

    const { name, price, stockQuantity, description, categoryId, subcategoryId, brand, imageUrls, specifications } =
      req.body;

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
    if (stockQuantity !== undefined) {
      const normalizedStock = Number(stockQuantity);
      if (!Number.isFinite(normalizedStock) || normalizedStock < 0) {
        return res.status(400).json({ message: "stockQuantity must be a valid non-negative number" });
      }
      updateData.stockQuantity = normalizedStock;
    }
    if (description !== undefined) updateData.description = description;
    if (brand !== undefined) updateData.brand = brand;
    if (imageUrls !== undefined) updateData.imageUrls = Array.isArray(imageUrls) ? imageUrls : [];
    if (specifications !== undefined) updateData.specifications = specifications ?? {};
    if (categoryId !== undefined) updateData.categoryId = Number(categoryId);
    if (subcategoryId !== undefined) updateData.subcategoryId = Number(subcategoryId);

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
      include: { subcategories: { orderBy: { name: "asc" } } },
      orderBy: { name: "asc" },
    });
    return res.json(categories);
  } catch (error) {
    return next(error);
  }
};

export const createAdminCategory = async (req, res, next) => {
  try {
    const { name, parentCategoryId } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const slug = slugify(name);
    if (parentCategoryId !== undefined && parentCategoryId !== null) {
      const subcategory = await prisma.subcategory.create({
        data: { name, slug, categoryId: Number(parentCategoryId) },
      });
      return res.status(201).json(subcategory);
    }

    const category = await prisma.category.create({ data: { name, slug } });
    return res.status(201).json(category);
  } catch (error) {
    return next(error);
  }
};

export const updateAdminCategory = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid category id" });

    const { name, parentCategoryId, isSubcategory } = req.body;
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
