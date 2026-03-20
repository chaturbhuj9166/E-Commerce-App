import express from "express";
import {
  createCategory,
  getAllCategories,
} from "../controllers/categoryController.js";

const router = express.Router();

// ================ CREATE CATEGORY ================
router.post("/create", createCategory);
router.get("/", getAllCategories);

export default router;