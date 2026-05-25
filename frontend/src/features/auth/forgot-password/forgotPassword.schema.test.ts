import { describe, it, expect } from "vitest";
import { forgotPasswordSchema } from "./forgotPassword.schema";

describe("forgotPasswordSchema", () => {
  it("accepts valid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "user@example.com" }).success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Invalid email address");
  });

  it("rejects missing email", () => {
    const result = forgotPasswordSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
