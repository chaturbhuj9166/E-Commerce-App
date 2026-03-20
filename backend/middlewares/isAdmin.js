export const isAdmin = (req, res, next) => {

  // ❌ Mobile block
  if (!req.headers.origin) {
    return res.status(403).json({
      message: "Admin access only from web",
    });
  }

  // ❌ Role check
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin only",
    });
  }

  next();
};