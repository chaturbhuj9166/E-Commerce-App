import Auth from "../models/Authmodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await Auth.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied (Admin only)" });
    }

    // 🔥 Mobile block (React Native)
    const isMobile = !req.headers.origin;

    if (isMobile) {
      return res.status(403).json({
        message: "Admin login allowed only on laptop/web",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Admin login successful",
      admin: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

/* ================= ADMIN LOGOUT ================= */
export async function logoutAdmin(req, res) {
  try {
    res.clearCookie("admin_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("ADMIN LOGOUT ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

/* ================= ADMIN DASHBOARD STATS ================= */
export async function adminStats(req, res) {
  try {
    const [totalUsers, totalAdmins, totalProducts] = await Promise.all([
      Auth.countDocuments({ role: "user" }),
      Auth.countDocuments({ role: "admin" }),
      Product.countDocuments(),
    ]);

    return res.status(200).json({
      totalUsers,
      totalAdmins,
      totalProducts,
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

/* ================= UPDATE ADMIN (PLACEHOLDER) ================= */
export async function updateAdmin(req, res) {
  return res.status(200).json({
    message: "Update Admin API ready",
  });
}
