import cors from "cors";
import express from "express";
import path from "path";

import cookieParser from "cookie-parser";

import "dotenv/config";
import checkRouter from "./routes/check.js";
import productRouter from "./routes/productRouter.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import cartRouter from "./routes/cart.js";
import couponRouter from "./routes/coupon.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import chatRouter from "./routes/chatRouter.js";
import dotenv from "dotenv";
import connectToDB from "./db/connect.js";
import orderRouter from "./routes/orderRouter.js";



const app = express();
dotenv.config();


app.use(cors({
  origin: "*",
}));

// Allow postMessage from Google popups — relax COOP to allow popups
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

app.use(express.json());
/* ================= MIDDLEWARES ================= */


app.use(cookieParser());

/* ================= DATABASE ================= */
await connectToDB();

/* ================= STATIC FILES ================= */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ================= ROUTES ================= */
app.use("/product", productRouter);
app.use("/user", authRouter);
app.use("/admin", adminRouter);
app.use("/cart", cartRouter);
app.use("/check", checkRouter); 
app.use("/coupon", couponRouter);
app.use("/category", categoryRoutes);
app.use("/chat", chatRouter);

app.use("/api/orders", orderRouter);


/* ================= SERVER ================= */
const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
