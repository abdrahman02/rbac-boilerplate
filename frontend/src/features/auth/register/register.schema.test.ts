import { describe, it, expect } from "vitest";
import { registerSchema } from "./register.schema";

const validData = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  password: "password123",
  confirmPassword: "password123",
};

describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    expect(registerSchema.safeParse(validData).success).toBe(true);
  });
  it("rejects name shorter than 2 characters", () => {
    const result = registerSchema.safeParse({ ...validData, name: "A" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Name must be at least 2 characters");
  });
  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({ ...validData, email: "not-an-email" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Invalid email address");
  });
  it("rejects password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({ ...validData, password: "short", confirmPassword: "short" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Password must be at least 8 characters");
  });
  it("rejects when passwords do not match", () => {
    const result = registerSchema.safeParse({ ...validData, confirmPassword: "different" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Passwords do not match");
  });
});
