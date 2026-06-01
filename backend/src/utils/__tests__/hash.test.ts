import { describe, expect, it } from "vitest";
import { comparePassword, hashPassword } from "../hash.js";

describe("hash utils", () => {
  it("hashes password and verifies correct value", async () => {
    const hash = await hashPassword("Secret123!");
    expect(hash).not.toBe("Secret123!");
    await expect(comparePassword("Secret123!", hash)).resolves.toBe(true);
  });

  it("rejects incorrect password", async () => {
    const hash = await hashPassword("Secret123!");
    await expect(comparePassword("wrong", hash)).resolves.toBe(false);
  });

  it("two hashes of the same password are different (salt)", async () => {
    const h1 = await hashPassword("Secret123!");
    const h2 = await hashPassword("Secret123!");
    expect(h1).not.toBe(h2);
  });
});
