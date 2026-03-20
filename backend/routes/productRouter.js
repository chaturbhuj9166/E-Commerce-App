import { Router } from "express";
import upload from "../middlewares/Upload.js";

import {
  addProduct,
  getProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  checkSlug,
  getProductBySlug,
} from "../controllers/product.js";

const router = Router();

router.get("/", getProduct);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

router.post("/", upload.array("images", 5), addProduct);
router.put("/:id", upload.array("images", 5), updateProduct);
router.delete("/:id", deleteProduct);

router.get("/checkSlug/:slug", checkSlug); 

export default router;
