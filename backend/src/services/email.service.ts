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

/**
 * Sends a password reset email to the specified recipient.
 *
 * @param to    - Recipient email address
 * @param name  - Recipient display name (used in the email greeting)
 * @param token - Raw reset token to embed in the link
 */
export async function sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"${env.APP_NAME}" <${env.SMTP_FROM}>`,
    to,
    subject: `Reset your password — ${env.APP_NAME}`,
    text: `Hi ${name},\n\nYou requested a password reset. Visit the link below to set a new password:\n\n${resetUrl}\n\nThis link expires in 30 minutes.\n\nIf you did not request this, you can safely ignore this email.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2>Reset your password</h2>
        <p>Hi ${name},</p>
        <p>You requested a password reset. Click the button below to set a new password.</p>
        <p style="margin: 32px 0;">
          <a href="${resetUrl}"
             style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Reset Password
          </a>
        </p>
        <p>Or copy this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p><small>This link expires in 30 minutes. If you did not request a password reset, ignore this email.</small></p>
      </div>
    `,
  });
}

/**
 * Sends an invitation email to a newly created user so they can set their password.
 *
 * @param to    - Recipient email address
 * @param name  - Recipient display name (used in the email greeting)
 * @param token - Raw invite token to embed in the set-password link
 */
export async function sendInviteEmail(to: string, name: string, token: string): Promise<void> {
  const inviteUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"${env.APP_NAME}" <${env.SMTP_FROM}>`,
    to,
    subject: `You've been invited to ${env.APP_NAME}`,
    text: `Hi ${name},\n\nAn account has been created for you on ${env.APP_NAME}. Set your password to activate it:\n\n${inviteUrl}\n\nThis link expires in 7 days.\n\nIf you were not expecting this invitation, you can safely ignore this email.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2>You've been invited to ${env.APP_NAME}</h2>
        <p>Hi ${name},</p>
        <p>An account has been created for you. Click the button below to set your password and activate it.</p>
        <p style="margin: 32px 0;">
          <a href="${inviteUrl}"
             style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Set Your Password
          </a>
        </p>
        <p>Or copy this link into your browser:</p>
        <p><a href="${inviteUrl}">${inviteUrl}</a></p>
        <p><small>This link expires in 7 days. If you were not expecting this invitation, ignore this email.</small></p>
      </div>
    `,
  });
}

/**
 * Sends a notification email to a user after their password has been changed.
 * Includes a link to the forgot-password page in case the change was not authorized.
 *
 * @param to   - Recipient email address
 * @param name - Recipient display name (used in the email greeting)
 */
export async function sendPasswordChangedEmail(to: string, name: string): Promise<void> {
  const resetUrl = `${env.FRONTEND_URL}/forgot-password`;

  await transporter.sendMail({
    from: `"${env.APP_NAME}" <${env.SMTP_FROM}>`,
    to,
    subject: `Your password was changed — ${env.APP_NAME}`,
    text: `Hi ${name},\n\nYour password was just changed. If this was you, no action is needed.\n\nIf you did not make this change, reset your password immediately:\n\n${resetUrl}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2>Your password was changed</h2>
        <p>Hi ${name},</p>
        <p>Your password was just changed. If this was you, no action is needed.</p>
        <p>If you did not make this change, reset your password immediately.</p>
        <p style="margin: 32px 0;">
          <a href="${resetUrl}"
             style="display: inline-block; padding: 12px 24px; background: #dc2626; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Reset Password
          </a>
        </p>
        <p><small>If you made this change yourself, you can safely ignore this email.</small></p>
      </div>
    `,
  });
}
