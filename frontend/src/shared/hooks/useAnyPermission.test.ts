import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { useAnyPermission } from "./useAnyPermission";

describe("useAnyPermission", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it("returns true when permissions array is empty", () => {
    const { result } = renderHook(() => useAnyPermission([]));
    expect(result.current).toBe(true);
  });

  it("returns true when user has at least one matching permission", () => {
    useAuthStore.setState({
      user: { id: 1, name: "Test", email: "t@t.com", roles: [], permissions: ["roles:read"] },
      isAuthenticated: true,
    });
    const { result } = renderHook(() => useAnyPermission(["roles:read", "permissions:read"]));
    expect(result.current).toBe(true);
  });

  it("returns false when user has none of the given permissions", () => {
    useAuthStore.setState({
      user: { id: 1, name: "Test", email: "t@t.com", roles: [], permissions: ["users:read"] },
      isAuthenticated: true,
    });
    const { result } = renderHook(() => useAnyPermission(["roles:read", "permissions:read"]));
    expect(result.current).toBe(false);
  });

  it("returns false when user is null", () => {
    const { result } = renderHook(() => useAnyPermission(["roles:read"]));
    expect(result.current).toBe(false);
  });
});
