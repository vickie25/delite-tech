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
import {
  getAdminAnalytics,
  getAdminSearch,
  getAdminOrder,
  patchAdminOrder,
  getAdminCustomer,
  patchAdminCustomer,
  getAdminReviews,
  patchAdminReview,
  postAdminReview,
  getAdminPromotions,
  postAdminPromotion,
  patchAdminPromotion,
  deleteAdminPromotion,
  getAdminStoreSettings,
  putAdminStoreSettings,
  postAdminProductsBulk,
  reorderAdminCategories,
  getAdminStockLogs,
  getAdminAdmins,
  patchAdminAdminUser,
} from "../controllers/admin.dashboard.controller.js";
import { requireAdminAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use("/api/admin", requireAdminAuth);

router.get("/api/admin/overview", getAdminOverview);
router.get("/api/admin/analytics", getAdminAnalytics);
router.get("/api/admin/search", getAdminSearch);

router.get("/api/admin/products", getAdminProducts);
router.post("/api/admin/products", createAdminProduct);
router.post("/api/admin/products/bulk", postAdminProductsBulk);
router.put("/api/admin/products/:id", updateAdminProduct);
router.delete("/api/admin/products/:id", deleteAdminProduct);

router.get("/api/admin/categories", getAdminCategories);
router.post("/api/admin/categories", createAdminCategory);
router.post("/api/admin/categories/reorder", reorderAdminCategories);
router.put("/api/admin/categories/:id", updateAdminCategory);
router.delete("/api/admin/categories/:id", deleteAdminCategory);

router.get("/api/admin/orders", getAdminOrders);
router.get("/api/admin/orders/:id", getAdminOrder);
router.patch("/api/admin/orders/:id", patchAdminOrder);

router.get("/api/admin/customers", getAdminCustomers);
router.get("/api/admin/customers/:id", getAdminCustomer);
router.patch("/api/admin/customers/:id", patchAdminCustomer);

router.get("/api/admin/reviews", getAdminReviews);
router.post("/api/admin/reviews", postAdminReview);
router.patch("/api/admin/reviews/:id", patchAdminReview);

router.get("/api/admin/promotions", getAdminPromotions);
router.post("/api/admin/promotions", postAdminPromotion);
router.patch("/api/admin/promotions/:id", patchAdminPromotion);
router.delete("/api/admin/promotions/:id", deleteAdminPromotion);

router.get("/api/admin/store-settings", getAdminStoreSettings);
router.put("/api/admin/store-settings", putAdminStoreSettings);

router.get("/api/admin/inventory/logs", getAdminStockLogs);

router.get("/api/admin/admins", getAdminAdmins);
router.patch("/api/admin/admins/:id", patchAdminAdminUser);

export default router;
