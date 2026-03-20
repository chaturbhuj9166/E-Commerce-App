import express from "express";
import {
  addCoupon,
  applyCoupon,
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
getCouponById
} from "../controllers/Coupon.js";

const router = express.Router();

router.post("/add", addCoupon);
router.post("/apply", applyCoupon);
router.put("/update/:id", updateCoupon);
router.delete("/delete/:id", deleteCoupon);
router.get("/all", getAllCoupons);

+ // ✅ GET SINGLE COUPON (FOR EDIT)
+ router.get("/:id", getCouponById);

export default router;
