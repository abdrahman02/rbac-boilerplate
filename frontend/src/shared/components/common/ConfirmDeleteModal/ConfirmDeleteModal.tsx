"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, FormField, Input, Modal } from "@/shared/components/ui";
import { confirmModalSchema, ConfirmModalInput } from "./ConfirmDeleteModal.schema";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  /** User must type this exact string to enable the delete button */
  confirmText: string;
  confirmLabel?: string;
  isLoading?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  confirmLabel = "Delete",
  isLoading,
}: ConfirmDeleteModalProps) {
  const { register, watch, reset } = useForm<ConfirmModalInput>({
    resolver: zodResolver(confirmModalSchema),
    defaultValues: { confirm: "" },
    mode: "onChange",
  });

  const confirmValue = watch("confirm");
  const isMatch = confirmValue === confirmText;

  useEffect(() => {
    if (!isOpen) reset({ confirm: "" });
  }, [isOpen, reset]);

  const handleClose = () => {
    reset({ confirm: "" });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMatch) onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} maxWidth="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 pt-1">
        <p className="text-sm text-muted-foreground">{description}</p>

        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-destructive/[.08] border border-destructive/[.22] text-destructive text-[13px]">
          <TriangleAlert size={15} className="mt-0.5 shrink-0" />
          <span>This action is irreversible and will be recorded in the audit log.</span>
        </div>

        <FormField
          label={
            <span>
              Type{" "}
              <code className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded border border-border">
                {confirmText}
              </code>{" "}
              to confirm
            </span>
          }
          htmlFor="confirm-delete-input"
        >
          <Input
            id="confirm-delete-input"
            {...register("confirm")}
            placeholder={confirmText}
          />
        </FormField>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" disabled={!isMatch} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
