import { Router } from "express";
import {
  getCurrentCustomer,
  loginAdmin,
  loginCustomer,
  logoutAdmin,
  logoutCustomer,
  refreshCustomerToken,
  registerCustomer,
  requestPasswordReset,
  resetPassword,
  updateCurrentCustomer,
} from "../controllers/auth.controller.js";
import { requireAdminAuth, requireCustomerAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/admin/login", loginAdmin);
router.post("/admin/logout", requireAdminAuth, logoutAdmin);
router.post("/refresh-token", refreshCustomerToken);
router.post("/logout", requireCustomerAuth, logoutCustomer);
router.post("/password-reset/request", requestPasswordReset);
router.post("/password-reset/confirm", resetPassword);
router.get("/me", requireCustomerAuth, getCurrentCustomer);
router.patch("/me", requireCustomerAuth, updateCurrentCustomer);

export default router;
