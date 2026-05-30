import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRoles } from "@/features/roles/hooks/useRoles";
import { getErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/lib/toast";
import type { UserWithRoles } from "@/shared/types";
import { useSyncRoles } from "../../hooks";
import { type AssignRoleInput, type AssignRoleOutput, assignRoleSchema } from "./AssignRoleModal.schema";

interface Params {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithRoles;
}

export const useAssignRoleModal = ({ isOpen, onClose, user }: Params) => {
  const { data: rolesData } = useRoles({ limit: -1 });
  const roles = useMemo(() => rolesData ?? [], [rolesData]);
  const syncRoles = useSyncRoles();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<AssignRoleInput, unknown, AssignRoleOutput>({
    resolver: zodResolver(assignRoleSchema),
    defaultValues: { roleIds: [] },
  });

  const originalRoleIds = useMemo(
    () => new Set(roles.filter((r) => user.roles.includes(r.name)).map((r) => r.id)),
    [roles, user.roles],
  );

  useEffect(() => {
    if (isOpen) {
      reset({ roleIds: [...originalRoleIds] });
    }
  }, [isOpen, originalRoleIds, reset]);

  const roleIdsArr = useWatch({ control, name: "roleIds" });

  const selectedIds = useMemo(() => new Set(roleIdsArr), [roleIdsArr]);

  const toggle = useCallback(
    (id: number) => {
      const current = getValues("roleIds");
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      setValue("roleIds", [...next], { shouldDirty: true });
    },
    [getValues, setValue],
  );

  const added = useMemo(() => roleIdsArr.filter((id) => !originalRoleIds.has(id)), [roleIdsArr, originalRoleIds]);

  const removed = useMemo(
    () => [...originalRoleIds].filter((id) => !selectedIds.has(id)),
    [originalRoleIds, selectedIds],
  );

  const onSubmit = (data: AssignRoleInput) => {
    syncRoles.mutate(
      { userId: user.id, roleIds: data.roleIds },
      {
        onSuccess: () => {
          toast.success("Roles updated", { description: user.name });
          onClose();
        },
        onError: (err) => setError("root", { message: getErrorMessage(err) }),
      },
    );
  };

  const handleClose = useCallback(() => {
    reset({ roleIds: [...originalRoleIds] });
    onClose();
  }, [reset, originalRoleIds, onClose]);

  return {
    handleSubmit,
    onSubmit,
    handleClose,
    errors,
    selectedIds,
    roles,
    originalRoleIds,
    toggle,
    isDirty,
    added,
    removed,
    isSubmitting: syncRoles.isPending,
  };
};
