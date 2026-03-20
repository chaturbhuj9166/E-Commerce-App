
import Coupon from "../models/Coupon.js";

/* ======================
   ADMIN: GET ALL COUPONS
====================== */
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
      coupons,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ======================
   ADMIN: ADD COUPON
====================== */
export const addCoupon = async (req, res) => {
  try {
    const { code, discount, startDate, expiryDate } = req.body;

    if (!code || !discount || !startDate || !expiryDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (new Date(startDate) >= new Date(expiryDate)) {
      return res.status(400).json({
        message: "Expiry date must be after start date",
      });
    }

    const existingCoupon = await Coupon.findOne({ code });

    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const coupon = await Coupon.create({
      code,
      discount,
      startDate,
      expiryDate,
    });

    res.status(201).json({
      message: "Coupon added successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================
   USER: APPLY COUPON
====================== */
export const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code || !cartTotal) {
      return res
        .status(400)
        .json({ message: "Coupon code and cart total required" });
    }

    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon" });
    }

    const now = new Date();

    // ⛔ Coupon not started yet
    if (now < new Date(coupon.startDate)) {
      return res.status(400).json({ message: "Coupon not active yet" });
    }

    // ⛔ Coupon expired
    if (now > new Date(coupon.expiryDate)) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    const discountAmount = (cartTotal * coupon.discount) / 100;
    const finalPrice = cartTotal - discountAmount;

    res.status(200).json({
      message: "Coupon applied successfully",
      discountPercentage: coupon.discount,
      discountAmount,
      finalPrice,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================
   ADMIN: UPDATE COUPON
====================== */
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount, startDate, expiryDate } = req.body;

    if (!code || !discount || !startDate || !expiryDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (new Date(startDate) >= new Date(expiryDate)) {
      return res.status(400).json({
        message: "Expiry date must be after start date",
      });
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { code, discount, startDate, expiryDate },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({
      message: "Coupon updated successfully",
      coupon: updatedCoupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================
   ADMIN: DELETE COUPON
====================== */
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
/* ======================
   ADMIN: GET SINGLE COUPON
====================== */
export const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
