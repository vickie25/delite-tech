import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import {
  hashToken,
  signAccessToken,
  signAdminAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";
import { sendMail } from "../services/mailer.service.js";
import { loadEmailTemplate } from "../services/email-template.service.js";

const publicCustomer = {
  id: true,
  name: true,
  email: true,
  phone: true,
  address: true,
  createdAt: true,
  updatedAt: true,
};

const issueAuthTokens = (customer) => {
  const accessToken = signAccessToken(customer);
  const refreshToken = signRefreshToken(customer);

  return { accessToken, refreshToken };
};

const publicCustomerFromModel = (customer) => ({
  id: customer.id,
  name: customer.name,
  email: customer.email,
  phone: customer.phone,
  address: customer.address,
});

const verifyAdminPassword = async (plainPassword, storedPasswordHash) => {
  if (!storedPasswordHash) return false;
  if (storedPasswordHash.startsWith("$2a$") || storedPasswordHash.startsWith("$2b$")) {
    return bcrypt.compare(plainPassword, storedPasswordHash);
  }
  return storedPasswordHash === plainPassword;
};

export const registerCustomer = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "Customer with that email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone: phone || null,
        address: address || null,
        passwordHash,
      },
      select: publicCustomer,
    });

    const { accessToken, refreshToken } = issueAuthTokens(customer);
    await prisma.customer.update({
      where: { id: customer.id },
      data: { refreshTokenHash: hashToken(refreshToken) },
    });

    try {
      const welcomeHtml = await loadEmailTemplate("welcome.html");
      const personalizedWelcomeHtml = welcomeHtml.replace(
        "https://delight.tech/shop",
        `${env.frontendBaseUrl}/shop`,
      );

      await sendMail({
        to: customer.email,
        subject: "Welcome to Delight Tech",
        text: `Welcome to Delight Tech, ${customer.name}. Explore the collection: ${env.frontendBaseUrl}/shop`,
        html: personalizedWelcomeHtml,
      });
    } catch (mailError) {
      console.error("[mailer] Failed to send welcome email:", mailError.message);
    }

    return res.status(201).json({
      message: "Customer registered successfully",
      accessToken,
      refreshToken,
      token: accessToken,
      customer,
    });
  } catch (error) {
    return next(error);
  }
};

export const loginCustomer = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, customer.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = issueAuthTokens(customer);
    await prisma.customer.update({
      where: { id: customer.id },
      data: { refreshTokenHash: hashToken(refreshToken) },
    });

    return res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      token: accessToken,
      customer: publicCustomerFromModel(customer),
    });
  } catch (error) {
    return next(error);
  }
};

export const refreshCustomerToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "refreshToken is required" });
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (_error) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    if (!payload.customerId || payload.tokenType !== "refresh") {
      return res.status(401).json({ message: "Invalid refresh token payload" });
    }

    const customer = await prisma.customer.findUnique({ where: { id: payload.customerId } });
    if (!customer || !customer.refreshTokenHash) {
      return res.status(401).json({ message: "Refresh token is no longer valid" });
    }

    if (customer.refreshTokenHash !== hashToken(refreshToken)) {
      return res.status(401).json({ message: "Refresh token is no longer valid" });
    }

    const tokens = issueAuthTokens(customer);
    await prisma.customer.update({
      where: { id: customer.id },
      data: { refreshTokenHash: hashToken(tokens.refreshToken) },
    });

    return res.json({
      message: "Token refreshed",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      token: tokens.accessToken,
      customer: publicCustomerFromModel(customer),
    });
  } catch (error) {
    return next(error);
  }
};

export const logoutCustomer = async (req, res, next) => {
  try {
    const { refreshToken } = req.body ?? {};

    if (!req.customer?.customerId && !refreshToken) {
      return res.status(400).json({ message: "Authorization or refreshToken is required" });
    }

    let customerId = req.customer?.customerId;
    if (!customerId && refreshToken) {
      try {
        const payload = verifyRefreshToken(refreshToken);
        customerId = payload.customerId;
      } catch (_error) {
        return res.status(401).json({ message: "Invalid or expired refresh token" });
      }
    }

    await prisma.customer.update({
      where: { id: customerId },
      data: { refreshTokenHash: null },
    });

    return res.json({ message: "Logout successful" });
  } catch (error) {
    return next(error);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    const customer = await prisma.customer.findUnique({ where: { email } });
    if (customer) {
      const rawResetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenHash = hashToken(rawResetToken);
      const resetPasswordExpiresAt = new Date(Date.now() + 1000 * 60 * 60);

      await prisma.customer.update({
        where: { id: customer.id },
        data: { resetPasswordTokenHash: resetTokenHash, resetPasswordExpiresAt },
      });

      const resetUrl = `${env.frontendBaseUrl}/reset-password?token=${encodeURIComponent(rawResetToken)}`;
      const messageText = `Hello ${customer.name || "customer"},

We received a request to reset your Delight Tech account password.

Use this link to reset your password:
${resetUrl}

This link expires in 1 hour.

If you did not request this change, you can safely ignore this email.`;

      const messageHtml = `
        <p>Hello ${customer.name || "customer"},</p>
        <p>We received a request to reset your Delight Tech account password.</p>
        <p>
          Use this link to reset your password:<br />
          <a href="${resetUrl}">${resetUrl}</a>
        </p>
        <p>This link expires in <strong>1 hour</strong>.</p>
        <p>If you did not request this change, you can safely ignore this email.</p>
      `;

      await sendMail({
        to: customer.email,
        subject: "Delight Tech password reset",
        text: messageText,
        html: messageHtml,
      });

      const response = {
        message: "If this email exists, a password reset token has been issued",
      };
      if (env.nodeEnv !== "production") {
        response.resetToken = rawResetToken;
      }
      return res.json(response);
    }

    return res.json({ message: "If this email exists, a password reset token has been issued" });
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "token and newPassword are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const customer = await prisma.customer.findFirst({
      where: {
        resetPasswordTokenHash: hashToken(token),
        resetPasswordExpiresAt: { gt: new Date() },
      },
    });

    if (!customer) {
      return res.status(400).json({ message: "Reset token is invalid or expired" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        passwordHash,
        refreshTokenHash: null,
        resetPasswordTokenHash: null,
        resetPasswordExpiresAt: null,
      },
    });

    return res.json({ message: "Password reset successful. Please log in again." });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentCustomer = async (req, res, next) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.customer.customerId },
      select: publicCustomer,
    });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    return res.json(customer);
  } catch (error) {
    return next(error);
  }
};

export const updateCurrentCustomer = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const customer = await prisma.customer.update({
      where: { id: req.customer.customerId },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(address !== undefined ? { address } : {}),
      },
      select: publicCustomer,
    });

    return res.json({ message: "Profile updated", customer });
  } catch (error) {
    return next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const validPassword = await verifyAdminPassword(password, admin.passwordHash);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = signAdminAccessToken({ id: admin.id, email: admin.email });
    return res.json({
      message: "Admin login successful",
      accessToken,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const logoutAdmin = async (_req, res, next) => {
  try {
    // JWT-based admin sessions are client-side; endpoint exists for explicit admin logout flow.
    return res.json({ message: "Admin logout successful" });
  } catch (error) {
    return next(error);
  }
};
