import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginApi } from "./login.api";
import { apiClient } from "@/shared/lib/api-client";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { post: vi.fn() },
}));

const mockUser = {
  id: 1,
  email: "user@example.com",
  name: "Test User",
  roles: [],
  permissions: [],
};

describe("loginApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls POST /auth/login with the provided credentials", async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { data: mockUser } });
    const credentials = { email: "user@example.com", password: "password123" };

    await loginApi(credentials);

    expect(apiClient.post).toHaveBeenCalledWith("/auth/login", credentials);
  });

  it("returns the authenticated user from the response", async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { data: mockUser } });

    const result = await loginApi({ email: "user@example.com", password: "password123" });

    expect(result).toEqual(mockUser);
  });
});
