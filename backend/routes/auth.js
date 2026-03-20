import express from "express";
import {
  registerUser,
  verifyOtp,
  loginUsers,
  logoutUsers,
  getUsers,
  updateUsers,
  deleteUsers,
  blockUser,
} from "../controllers/AuthController.js";
import {
  googleLogin,
} from "../controllers/googleLogin.js";

const router = express.Router();

// AUTH
router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUsers);
router.post("/logout", logoutUsers);
router.post("/google-login", googleLogin);
// USERS
router.get("/users", getUsers);
router.put("/update/:id", updateUsers);
router.delete("/delete/:id", deleteUsers);
router.patch("/block/:id", blockUser);

export default router;
