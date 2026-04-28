import { Router } from "express";
import {
  getAdminCustomers,
  getAdminOrders,
  getAdminOverview,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "../controllers/admin.controller.js";
import { requireAdminAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Secure all admin routes
router.use("/api/admin", requireAdminAuth);

// Dashboard Overview
router.get("/api/admin/overview", getAdminOverview);

// Product Management
router.get("/api/admin/products", getAdminProducts);
router.post("/api/admin/products", createAdminProduct);
router.put("/api/admin/products/:id", updateAdminProduct);
router.delete("/api/admin/products/:id", deleteAdminProduct);

// Category Management
router.get("/api/admin/categories", getAdminCategories);
router.post("/api/admin/categories", createAdminCategory);
router.put("/api/admin/categories/:id", updateAdminCategory);
router.delete("/api/admin/categories/:id", deleteAdminCategory);

// Order & Customer Management
router.get("/api/admin/orders", getAdminOrders);
router.get("/api/admin/customers", getAdminCustomers);

export default router;
