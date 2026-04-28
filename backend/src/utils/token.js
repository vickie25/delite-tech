import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";

export const signAccessToken = (customer) =>
  jwt.sign({ customerId: customer.id, email: customer.email, tokenType: "access" }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

export const signAdminAccessToken = (admin) =>
  jwt.sign({ adminId: admin.id, email: admin.email, tokenType: "admin_access" }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

export const signCustomerToken = signAccessToken;

export const signRefreshToken = (customer) =>
  jwt.sign({ customerId: customer.id, email: customer.email, tokenType: "refresh" }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  });

export const verifyRefreshToken = (token) => jwt.verify(token, env.jwtRefreshSecret);

export const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
