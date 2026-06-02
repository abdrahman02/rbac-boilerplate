"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { RoleWithPermissions } from "@/shared/types";
import { useBroadcast } from "../../hooks";
import { type BroadcastInput, broadcastSchema } from "./BroadcastForm.schema";

interface Params {
  roles: RoleWithPermissions[];
}

export function useBroadcastForm({ roles }: Params) {
  const broadcast = useBroadcast();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<BroadcastInput>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: { title: "", message: "", role_ids: [] },
  });

  const selectedRoleIds = watch("role_ids") ?? [];

  function toggleRole(roleId: number): void {
    const updated = selectedRoleIds.includes(roleId)
      ? selectedRoleIds.filter((id) => id !== roleId)
      : [...selectedRoleIds, roleId];
    setValue("role_ids", updated, { shouldValidate: true });
  }

  function onSubmit(data: BroadcastInput): void {
    broadcast.mutate(data, {
      onSuccess: () => reset(),
      onError: (err) =>
        setError("root", {
          message: err instanceof Error ? err.message : "Terjadi kesalahan",
        }),
    });
  }

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    selectedRoleIds,
    toggleRole,
    isSubmitting: broadcast.isPending,
    roles,
  };
}
