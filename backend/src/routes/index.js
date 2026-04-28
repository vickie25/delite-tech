import { Router } from "express";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import catalogRoutes from "./catalog.routes.js";
import healthRoutes from "./health.routes.js";

const router = Router();

router.use(healthRoutes);
router.use("/api/auth", authRoutes);
router.use(adminRoutes);
router.use("/api", catalogRoutes);

export default router;
