import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { type ConfirmModalInput, confirmModalSchema } from "./ConfirmDeleteModal.schema";

interface Params {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmText: string;
}

export const useConfirmDelete = ({ isOpen, onClose, onConfirm, confirmText }: Params) => {
  const { control, register, reset } = useForm<ConfirmModalInput>({
    resolver: zodResolver(confirmModalSchema),
    defaultValues: { confirm: "" },
    mode: "onChange",
  });

  const confirmValue = useWatch({ control, name: "confirm" });
  const isMatch = confirmValue === confirmText;

  useEffect(() => {
    if (!isOpen) reset({ confirm: "" });
  }, [isOpen, reset]);

  const handleClose = useCallback(() => {
    reset({ confirm: "" });
    onClose();
  }, [reset, onClose]);

  const handleSubmit = useCallback(
    (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isMatch) onConfirm();
    },
    [isMatch, onConfirm],
  );

  return {
    register,
    isMatch,
    handleClose,
    handleSubmit,
  };
};
