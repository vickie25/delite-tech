import { Router } from "express";
import { createOrder, getCategories, getProducts } from "../controllers/catalog.controller.js";

const router = Router();

router.get("/categories", getCategories);
router.get("/products", getProducts);
router.post("/orders", createOrder);

export default router;
