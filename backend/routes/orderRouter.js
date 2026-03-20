import express from "express";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
} from "../controllers/orderController.js";

import { checkAuth } from "../middlewares/MiddlewaresAuth.js";

const router = express.Router();

router.post("/", checkAuth, placeOrder);
router.get("/my", checkAuth, getMyOrders); // Get My Orders
router.get("/all", checkAuth, getAllOrders);


export default router;
