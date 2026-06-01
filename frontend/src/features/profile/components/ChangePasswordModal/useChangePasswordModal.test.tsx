import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockLogout = vi.fn();

vi.mock("@/shared/components/layout/Header/useLogout", () => ({
  useLogout: () => mockLogout,
}));

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { post: vi.fn() },
}));

import { apiClient } from "@/shared/lib/api-client";
import { useChangePasswordModal } from "./useChangePasswordModal";

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={
      new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      })
    }
  >
    {children}
  </QueryClientProvider>
);

describe("useChangePasswordModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls logout on success instead of onClose or toast", async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({});

    const onClose = vi.fn();
    const { result } = renderHook(
      () => useChangePasswordModal({ isOpen: true, onClose }),
      { wrapper },
    );

    await act(async () => {
      result.current.onSubmit({
        current_password: "Old1234!",
        new_password: "New1234!",
        confirm_password: "New1234!",
      });
    });

    expect(mockLogout).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("sets root error and does NOT call logout on API failure", async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce(
      new Error("Current password is incorrect"),
    );

    const onClose = vi.fn();
    const { result } = renderHook(
      () => useChangePasswordModal({ isOpen: true, onClose }),
      { wrapper },
    );

    await act(async () => {
      result.current.onSubmit({
        current_password: "wrong",
        new_password: "New1234!",
        confirm_password: "New1234!",
      });
    });

    expect(mockLogout).not.toHaveBeenCalled();
    expect(result.current.errors.root?.message).toBeTruthy();
  });
});
