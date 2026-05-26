import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmModalSchema, ConfirmModalInput } from "./ConfirmDeleteModal.schema";
import { useCallback, useEffect } from "react";

interface Params {
    isOpen: boolean
    onClose: () => void
    confirmText: string
}

export const useConfirmDelete = ({ isOpen, onClose, confirmText }: Params) => {
    const { control, register, reset } = useForm<ConfirmModalInput>({
        resolver: zodResolver(confirmModalSchema),
        defaultValues: { confirm: "" },
        mode: "onChange",
    });

    const confirmValue = useWatch({ control, name: "confirm" })
    const isMatch = confirmValue === confirmText;

    useEffect(() => {
        if (!isOpen) reset({ confirm: "" });
    }, [isOpen, reset]);

    const handleClose = useCallback(() => {
        reset({ confirm: "" });
        onClose();
    }, [reset, onClose]);
}