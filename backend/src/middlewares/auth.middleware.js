import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const requireCustomerAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (!payload.customerId || payload.tokenType !== "access") {
      return res.status(403).json({ message: "Invalid customer token" });
    }
    req.customer = payload;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Admin authentication required" });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (!payload.adminId || payload.tokenType !== "admin_access") {
      return res.status(403).json({ message: "Invalid admin token" });
    }
    req.admin = payload;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
};
