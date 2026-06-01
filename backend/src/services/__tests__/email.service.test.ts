import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockSendMail } = vi.hoisted(() => ({
  mockSendMail: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail: mockSendMail })),
  },
}));

vi.mock("../../config/env.js", () => ({
  env: {
    SMTP_HOST: "sandbox.smtp.mailtrap.io",
    SMTP_PORT: 2525,
    SMTP_USER: "testuser",
    SMTP_PASS: "testpass",
    SMTP_FROM: "noreply@test.com",
    FRONTEND_URL: "http://localhost:3000",
    APP_NAME: "RBAC App",
  },
}));

import { sendInviteEmail, sendPasswordChangedEmail, sendPasswordResetEmail, sendVerificationEmail } from "../email.service.js";

describe("sendVerificationEmail", () => {
  beforeEach(() => vi.resetAllMocks());

  it("sends email to the correct recipient with verification link in body", async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: "test-id" });

    await sendVerificationEmail("user@example.com", "Alice", "rawtoken123");

    expect(mockSendMail).toHaveBeenCalledOnce();
    const mail = mockSendMail.mock.calls[0]![0];
    expect(mail.to).toBe("user@example.com");
    expect(mail.html).toContain("http://localhost:3000/verify-email?token=rawtoken123");
    expect(mail.text).toContain("http://localhost:3000/verify-email?token=rawtoken123");
  });

  it("sets subject containing 'Verify'", async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: "test-id" });

    await sendVerificationEmail("user@example.com", "Alice", "rawtoken123");

    const mail = mockSendMail.mock.calls[0]![0];
    expect(mail.subject).toContain("Verify");
  });

  it("includes user name in email html body", async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: "test-id" });

    await sendVerificationEmail("user@example.com", "Alice", "rawtoken123");

    const mail = mockSendMail.mock.calls[0]![0];
    expect(mail.html).toContain("Alice");
  });

  it("throws when SMTP transport fails", async () => {
    mockSendMail.mockRejectedValueOnce(new Error("SMTP connection refused"));

    await expect(sendVerificationEmail("user@example.com", "Alice", "rawtoken123")).rejects.toThrow(
      "SMTP connection refused",
    );
  });
});

describe("sendPasswordResetEmail", () => {
  beforeEach(() => vi.resetAllMocks());

  it("sends email to the correct recipient with reset link in body", async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: "test-id" });

    await sendPasswordResetEmail("user@example.com", "Alice", "rawtoken456");

    expect(mockSendMail).toHaveBeenCalledOnce();
    const mail = mockSendMail.mock.calls[0]![0];
    expect(mail.to).toBe("user@example.com");
    expect(mail.html).toContain("http://localhost:3000/reset-password?token=rawtoken456");
    expect(mail.text).toContain("http://localhost:3000/reset-password?token=rawtoken456");
  });

  it("sets subject containing 'Reset'", async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: "test-id" });

    await sendPasswordResetEmail("user@example.com", "Alice", "rawtoken456");

    const mail = mockSendMail.mock.calls[0]![0];
    expect(mail.subject).toContain("Reset");
  });

  it("includes user name in email html body", async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: "test-id" });

    await sendPasswordResetEmail("user@example.com", "Alice", "rawtoken456");

    const mail = mockSendMail.mock.calls[0]![0];
    expect(mail.html).toContain("Alice");
  });

  it("throws when SMTP transport fails", async () => {
    mockSendMail.mockRejectedValueOnce(new Error("SMTP connection refused"));

    await expect(sendPasswordResetEmail("user@example.com", "Alice", "rawtoken456")).rejects.toThrow(
      "SMTP connection refused",
    );
  });
});

describe("sendInviteEmail", () => {
  beforeEach(() => vi.resetAllMocks());

  it("sends to correct recipient with invite link in body", async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: "test-id" });

    await sendInviteEmail("user@example.com", "Alice", "invitetoken123");

    expect(mockSendMail).toHaveBeenCalledOnce();
    const mail = mockSendMail.mock.calls[0]![0];
    expect(mail.to).toBe("user@example.com");
    expect(mail.html).toContain("http://localhost:3000/reset-password?token=invitetoken123");
    expect(mail.text).toContain("http://localhost:3000/reset-password?token=invitetoken123");
  });

  it("sets subject containing 'invited'", async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: "test-id" });

    await sendInviteEmail("user@example.com", "Alice", "invitetoken123");

    const mail = mockSendMail.mock.calls[0]![0];
    expect(mail.subject.toLowerCase()).toContain("invited");
  });

  it("includes user name in html body", async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: "test-id" });

    await sendInviteEmail("user@example.com", "Alice", "invitetoken123");

    const mail = mockSendMail.mock.calls[0]![0];
    expect(mail.html).toContain("Alice");
  });

  it("throws when SMTP transport fails", async () => {
    mockSendMail.mockRejectedValueOnce(new Error("SMTP error"));

    await expect(sendInviteEmail("user@example.com", "Alice", "t")).rejects.toThrow("SMTP error");
  });
});

describe("sendPasswordChangedEmail", () => {
  beforeEach(() => vi.resetAllMocks());

  it("sends to correct recipient with forgot-password link in body", async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: "test-id" });

    await sendPasswordChangedEmail("user@example.com", "Alice");

    expect(mockSendMail).toHaveBeenCalledOnce();
    const mail = mockSendMail.mock.calls[0]![0];
    expect(mail.to).toBe("user@example.com");
    expect(mail.html).toContain("http://localhost:3000/forgot-password");
    expect(mail.text).toContain("http://localhost:3000/forgot-password");
  });

  it("does NOT contain a reset token in the body", async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: "test-id" });

    await sendPasswordChangedEmail("user@example.com", "Alice");

    const mail = mockSendMail.mock.calls[0]![0];
    expect(mail.html).not.toContain("token=");
  });

  it("sets subject containing 'password' and 'changed'", async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: "test-id" });

    await sendPasswordChangedEmail("user@example.com", "Alice");

    const mail = mockSendMail.mock.calls[0]![0];
    expect(mail.subject.toLowerCase()).toContain("password");
    expect(mail.subject.toLowerCase()).toContain("changed");
  });

  it("includes user name in html body", async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: "test-id" });

    await sendPasswordChangedEmail("user@example.com", "Alice");

    const mail = mockSendMail.mock.calls[0]![0];
    expect(mail.html).toContain("Alice");
  });
});
