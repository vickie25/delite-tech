import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

router.get("/", (_req, res) => {
  res.send("Delight-Tech Backend is running!");
});

router.get("/api/status", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ status: "success", message: "API and database are healthy" });
  } catch (error) {
    return next(error);
  }
});

export default router;
