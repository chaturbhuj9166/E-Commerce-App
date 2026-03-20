import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Auth from "../models/Authmodel.js";
import { generateOTP } from "../utils/otp.js";
import { sendOtpEmail, sendWelcomeEmail } from "../utils/sendEmail.js";

const OTP_EXPIRY_MS = 5 * 60 * 1000;

const normalizeEmail = (email = "") => email.trim().toLowerCase();
const normalizeOtp = (otp = "") => otp.toString().trim();

// ================= REGISTER =================
export async function registerUser(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const name = req.body.name?.trim();
    const username = req.body.username?.trim();
    const phone = req.body.phone?.trim();
    const password = req.body.password;

    if (!name || !email || !username || !phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await Auth.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser?.isVerified) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "User already exists" });
      }

      return res.status(400).json({ message: "Username already exists" });
    }

    if (existingUser && existingUser.email !== email && existingUser.username === username) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + OTP_EXPIRY_MS);

    if (existingUser) {
      existingUser.name = name;
      existingUser.email = email;
      existingUser.username = username;
      existingUser.phone = phone;
      existingUser.password = hashedPassword;
      existingUser.role = "user";
      existingUser.otp = otp;
      existingUser.otpExpire = otpExpire;
      existingUser.isVerified = false;
      existingUser.isBlocked = false;
      await existingUser.save();
    } else {
      await Auth.create({
        name,
        email,
        username,
        phone,
        password: hashedPassword,
        role: "user",
        otp,
        otpExpire,
        isVerified: false,
        isBlocked: false,
      });
    }

    try {
      await sendOtpEmail(email, otp);
    } catch (error) {
      console.error("EMAIL ERROR:", error.message);
      return res.status(502).json({
        message: "Could not send OTP email. Please try again.",
      });
    }

    return res.status(existingUser ? 200 : 201).json({
      message: existingUser
        ? "A new OTP has been sent to your email"
        : "Registered successfully. OTP sent to email",
      email,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
}

// ================= VERIFY OTP =================
export async function verifyOtp(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = normalizeOtp(req.body.otp);

    if (!email || !otp) {
      return res.status(400).json({ message: "Email & OTP required" });
    }

    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "Already verified" });
    }

    if (!user.otp || !user.otpExpire) {
      return res.status(400).json({ message: "No active OTP found. Please register again." });
    }

    if (new Date() >= new Date(user.otpExpire)) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (normalizeOtp(user.otp) !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      console.error("WELCOME EMAIL ERROR:", error.message);
    }

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
}

// ================= LOGIN =================
export async function loginUsers(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Verify your email first" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "User is blocked" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 3 * 60 * 60 * 1000,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
}

// ================= LOGOUT =================
export async function logoutUsers(req, res) {
  res.clearCookie("auth_token");
  return res.status(200).json({ message: "Logout successful" });
}

// ================= GET ALL USERS =================
export async function getUsers(req, res) {
  try {
    const users = await Auth.find().select("-password -otp -otpExpire");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ================= UPDATE USER =================
export async function updateUsers(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await Auth.findByIdAndUpdate(id, updates, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ================= DELETE USER =================
export async function deleteUsers(req, res) {
  try {
    const { id } = req.params;

    const deleted = await Auth.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ================= BLOCK / UNBLOCK USER =================
export async function blockUser(req, res) {
  try {
    const { id } = req.params;

    const user = await Auth.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return res.status(200).json({
      message: user.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
