import { Router } from "express";
import { getCategories, getProducts } from "../controllers/catalog.controller.js";

const router = Router();

router.get("/categories", getCategories);
router.get("/products", getProducts);

export default router;
