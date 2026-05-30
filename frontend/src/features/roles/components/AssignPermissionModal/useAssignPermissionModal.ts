import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { usePermissionList } from "@/features/permissions/hooks/usePermissionsCrud";
import { getErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/lib/toast";
import type { RoleWithPermissions } from "@/shared/types";
import { useSyncRolePermissions } from "../../hooks/useRoles";
import { type AssignPermissionInput, assignPermissionSchema } from "./AssignPermissionModal.schema";

interface Params {
  isOpen: boolean;
  onClose: () => void;
  role: RoleWithPermissions;
  search: string;
}

export function useAssignPermissionModal({ isOpen, onClose, role, search }: Params) {
  const { data: permissionsData } = usePermissionList();
  const permissions = useMemo(() => permissionsData ?? [], [permissionsData]);
  const syncPermissions = useSyncRolePermissions();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<AssignPermissionInput>({
    resolver: zodResolver(assignPermissionSchema),
    defaultValues: { permissionIds: [] },
  });

  const originalPermissionIds = useMemo(
    () => new Set(permissions.filter((p) => role.permissions.includes(p.name)).map((p) => p.id)),
    [permissions, role.permissions],
  );

  useEffect(() => {
    if (isOpen) {
      reset({ permissionIds: [...originalPermissionIds] });
    }
  }, [isOpen, originalPermissionIds, reset]);

  const permissionIdsArr = useWatch({ control, name: "permissionIds" });
  const selectedIds = useMemo(() => new Set(permissionIdsArr), [permissionIdsArr]);

  const toggle = useCallback(
    (id: number) => {
      const current = getValues("permissionIds");
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      setValue("permissionIds", [...next], { shouldDirty: true });
    },
    [getValues, setValue],
  );

  const toggleAll = useCallback(
    (ids: number[], allSelected: boolean) => {
      const current = getValues("permissionIds");
      const next = new Set(current);
      if (allSelected) {
        for (const id of ids) next.delete(id);
      } else {
        for (const id of ids) next.add(id);
      }
      setValue("permissionIds", [...next], { shouldDirty: true });
    },
    [getValues, setValue],
  );

  const filteredPermissions = useMemo(() => {
    if (!search) return permissions;
    const q = search.toLowerCase();
    return permissions.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q),
    );
  }, [permissions, search]);

  const added = useMemo(
    () => permissionIdsArr.filter((id) => !originalPermissionIds.has(id)),
    [permissionIdsArr, originalPermissionIds],
  );

  const removed = useMemo(
    () => [...originalPermissionIds].filter((id) => !selectedIds.has(id)),
    [originalPermissionIds, selectedIds],
  );

  const allFilteredSelected = useMemo(
    () => filteredPermissions.length > 0 && filteredPermissions.every((p) => selectedIds.has(p.id)),
    [filteredPermissions, selectedIds],
  );

  const onSubmit = (data: AssignPermissionInput) => {
    syncPermissions.mutate(
      { roleId: role.id, permissionIds: data.permissionIds },
      {
        onSuccess: () => {
          toast.success("Permissions updated", {
            description: `${role.name} · ${data.permissionIds.length} permission${data.permissionIds.length === 1 ? "" : "s"}`,
          });
          onClose();
        },
        onError: (err) => setError("root", { message: getErrorMessage(err) }),
      },
    );
  };

  const handleClose = useCallback(() => {
    reset({ permissionIds: [...originalPermissionIds] });
    onClose();
  }, [reset, originalPermissionIds, onClose]);

  return {
    handleSubmit,
    onSubmit,
    handleClose,
    errors,
    permissions,
    filteredPermissions,
    selectedIds,
    originalPermissionIds,
    toggle,
    toggleAll,
    allFilteredSelected,
    isDirty,
    added,
    removed,
    isSubmitting: syncPermissions.isPending,
  };
}
