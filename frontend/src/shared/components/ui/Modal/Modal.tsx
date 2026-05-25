"use client";

import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/shared/components/ui/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg";
}

const maxWidthClass = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export function Modal({ isOpen, onClose, title, children, maxWidth = "md" }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop uses click-to-close; keyboard handled via document keydown in useEffect
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && e.target === e.currentTarget && onClose()}
    >
      <div className={`w-full ${maxWidthClass[maxWidth]} rounded-lg bg-card shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-card-foreground">{title}</h2>
          <Button
            variant="ghost"
            size="iconOnly"
            onClick={onClose}
            aria-label="Close"
            className="rounded text-muted-foreground hover:text-foreground"
          >
            ✕
          </Button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
