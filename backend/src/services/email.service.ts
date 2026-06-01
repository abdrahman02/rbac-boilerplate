import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

/**
 * Sends an email verification message to the specified recipient.
 *
 * @param to    - Recipient email address
 * @param name  - Recipient display name (used in the email greeting)
 * @param token - Raw verification token to embed in the link
 */
export async function sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
  const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"${env.APP_NAME}" <${env.SMTP_FROM}>`,
    to,
    subject: `Verify your email — ${env.APP_NAME}`,
    text: `Hi ${name},\n\nPlease verify your email address by visiting the link below:\n\n${verificationUrl}\n\nThis link expires in 24 hours.\n\nIf you did not register an account, you can safely ignore this email.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2>Verify your email address</h2>
        <p>Hi ${name},</p>
        <p>Thanks for registering. Please verify your email address to activate your account.</p>
        <p style="margin: 32px 0;">
          <a href="${verificationUrl}"
             style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Verify Email Address
          </a>
        </p>
        <p>Or copy this link into your browser:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p><small>This link expires in 24 hours. If you did not register, ignore this email.</small></p>
      </div>
    `,
  });
}
