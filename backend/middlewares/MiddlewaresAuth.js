import jwt from "jsonwebtoken";

const getTokenFromRequest = (req, role) => {
  if (req.headers.authorization?.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  }

  if (role === "admin") {
    return req.cookies?.admin_token;
  }

  if (role === "user") {
    return req.cookies?.auth_token;
  }

  return req.cookies?.auth_token || req.cookies?.admin_token;
};

const verifyRequestToken = (req, role) => {
  const token = getTokenFromRequest(req, role);

  if (!token) {
    return null;
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};

export const checkAuth = (req, res, next) => {
  try {
    const decoded = verifyRequestToken(req);

    if (!decoded) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const checkForlogin = (req, res) => {
  try {
    const role = req.query.referer;
    const decoded = verifyRequestToken(req, role);

    if (!decoded) {
      return res.status(200).json({ loggedIn: false });
    }

    return res.status(200).json({
      loggedIn: true,
      id: decoded.id,
      role: decoded.role,
    });
  } catch (error) {
    return res.status(200).json({ loggedIn: false });
  }
};
