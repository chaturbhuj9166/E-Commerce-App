import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  updateAdmin,
  adminStats
} from "../controllers/AdminController.js";

import { checkAuth } from "../middlewares/MiddlewaresAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const adminRouter = Router();

// 🔐 Login
adminRouter.post("/login", loginAdmin);

// 🔐 Protected routes
adminRouter.get("/dashboard-stats", checkAuth, isAdmin, adminStats);
adminRouter.put("/:id", checkAuth, isAdmin, updateAdmin);
adminRouter.post("/logout", checkAuth, isAdmin, logoutAdmin);

export default adminRouter;