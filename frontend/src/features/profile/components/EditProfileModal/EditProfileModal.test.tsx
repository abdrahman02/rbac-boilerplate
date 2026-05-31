import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUseEditProfileModal = vi.fn();

vi.mock("./useEditProfileModal", () => ({
  useEditProfileModal: (...args: unknown[]) => mockUseEditProfileModal(...args),
}));

import { EditProfileModal } from "./EditProfileModal";

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

describe("EditProfileModal", () => {
  beforeEach(() => {
    mockUseEditProfileModal.mockReturnValue(baseHookReturn);
  });

  it("renders Full name and Email fields", () => {
    render(<EditProfileModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("renders Save changes and Cancel buttons", () => {
    render(<EditProfileModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", () => {
    const onClose = vi.fn();
    render(<EditProfileModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("shows Alert when root error is set", () => {
    mockUseEditProfileModal.mockReturnValue({
      ...baseHookReturn,
      errors: { root: { message: "Email already in use." } },
    });
    render(<EditProfileModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText("Email already in use.")).toBeInTheDocument();
  });
});
