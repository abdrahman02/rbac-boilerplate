import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerApi } from "./register.api";
import { apiClient } from "@/shared/lib/api-client";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { post: vi.fn() },
}));

const mockUser = { id: 2, email: "ada@example.com", name: "Ada Lovelace", roles: [], permissions: [] };

describe("registerApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls POST /auth/register with name, email, and password", async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { data: mockUser } });
    await registerApi({ name: "Ada Lovelace", email: "ada@example.com", password: "password123" });
    expect(apiClient.post).toHaveBeenCalledWith("/auth/register", {
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    });
  });

  it("does not send confirmPassword to the API", async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { data: mockUser } });
    await registerApi({ name: "Ada Lovelace", email: "ada@example.com", password: "password123" });
    expect(apiClient.post).not.toHaveBeenCalledWith(
      "/auth/register",
      expect.objectContaining({ confirmPassword: expect.anything() }),
    );
  });

  it("returns the authenticated user from the response", async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { data: mockUser } });
    const result = await registerApi({ name: "Ada Lovelace", email: "ada@example.com", password: "password123" });
    expect(result).toEqual(mockUser);
  });
});
