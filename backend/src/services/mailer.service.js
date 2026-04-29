import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporterPromise;

const createTransporter = async () => {
  if (env.smtpHost && env.smtpUser && env.smtpPass) {
    const smtpTransporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });

    if (env.nodeEnv !== "production") {
      try {
        await smtpTransporter.verify();
        console.log("[mailer] SMTP transport verified");
      } catch (error) {
        console.error("[mailer] SMTP verification failed:", error.message);
      }
    }

    return smtpTransporter;
  }

  if (env.nodeEnv === "production") {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS.");
  }

  const testAccount = await nodemailer.createTestAccount();
  const etherealTransporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  console.log("[mailer] Using Ethereal test inbox for development");
  return etherealTransporter;
};

const getTransporter = async () => {
  if (!transporterPromise) {
    transporterPromise = createTransporter();
  }
  return transporterPromise;
};

export const verifyMailerConnection = async () => {
  try {
    const transporter = await getTransporter();
    await transporter.verify();
    return { ok: true };
  } catch (error) {
    console.error("[mailer] Mailer verification skipped:", error.message);
    return { ok: false, error: error.message };
  }
};

export const sendMail = async ({ to, subject, text, html }) => {
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    text,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[mailer] Preview URL: ${previewUrl}`);
  }

  return {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response,
    previewUrl: previewUrl || null,
  };
};
