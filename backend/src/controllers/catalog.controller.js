import { ProductStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";

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
