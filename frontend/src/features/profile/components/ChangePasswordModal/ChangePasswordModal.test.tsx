import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUseChangePasswordModal = vi.fn();

vi.mock("./useChangePasswordModal", () => ({
  useChangePasswordModal: (...args: unknown[]) => mockUseChangePasswordModal(...args),
}));

import { ChangePasswordModal } from "./ChangePasswordModal";

const baseHookReturn = {
  register: () => ({ name: "", onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() }),
  handleSubmit: (fn: (data: unknown) => void) => (e: React.FormEvent) => {
    e.preventDefault();
    fn({});
  },
  onSubmit: vi.fn(),
  errors: {},
  isSubmitting: false,
};

describe("ChangePasswordModal", () => {
  beforeEach(() => {
    mockUseChangePasswordModal.mockReturnValue(baseHookReturn);
  });

  it("renders Current password, New password, and Confirm password fields", () => {
    render(<ChangePasswordModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("renders Change password and Cancel buttons", () => {
    render(<ChangePasswordModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByRole("button", { name: /change password/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", () => {
    const onClose = vi.fn();
    render(<ChangePasswordModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("shows Alert when root error is set", () => {
    mockUseChangePasswordModal.mockReturnValue({
      ...baseHookReturn,
      errors: { root: { message: "Current password is incorrect." } },
    });
    render(<ChangePasswordModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText("Current password is incorrect.")).toBeInTheDocument();
  });
});
