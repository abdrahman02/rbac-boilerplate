"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Alert, Button, Input, Modal } from "@/shared/components/ui";
import type { RoleWithPermissions } from "@/shared/types";
import { PermissionCheckbox } from "../PermissionCheckbox";
import { useAssignPermissionModal } from "./useAssignPermissionModal";

interface AssignPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleWithPermissions;
}

export function AssignPermissionModal({ isOpen, onClose, role }: AssignPermissionModalProps) {
  const [search, setSearch] = useState("");

  const {
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
    isSubmitting,
  } = useAssignPermissionModal({ isOpen, onClose, role, search });

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Manage permissions — ${role.name}`} maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5 pt-1">
        <p className="text-sm text-muted-foreground">
          A role can hold any number of permissions. Toggle each capability you want this role to grant.
        </p>

        {errors.root?.message && <Alert message={errors.root.message} />}

        {/* Search + select all */}
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <Input
              placeholder="Search permissions"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              iconLeft={<Search size={14} />}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              toggleAll(
                filteredPermissions.map((p) => p.id),
                allFilteredSelected,
              )
            }
            disabled={filteredPermissions.length === 0}
          >
            {allFilteredSelected ? "Clear all" : "Select all"}
          </Button>
        </div>

        {/* Count summary */}
        <div className="flex items-center justify-between px-1 text-[12px] text-muted-foreground">
          <span>
            {selectedIds.size} of {permissions.length} selected
          </span>
          {isDirty && (
            <span>
              {added.length > 0 && <span className="text-success font-medium">+{added.length} adding</span>}
              {added.length > 0 && removed.length > 0 && " · "}
              {removed.length > 0 && <span className="text-destructive font-medium">−{removed.length} removing</span>}
            </span>
          )}
        </div>

        {/* Permission list */}
        <div className="flex flex-col gap-1.5 max-h-[340px] overflow-y-auto pr-1">
          {filteredPermissions.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No permissions match your search.</p>
          ) : (
            filteredPermissions.map((perm) => {
              const isChecked = selectedIds.has(perm.id);
              const wasChecked = originalPermissionIds.has(perm.id);
              return (
                <PermissionCheckbox
                  key={perm.id}
                  permission={perm}
                  checked={isChecked}
                  adding={isChecked && !wasChecked}
                  removing={!isChecked && wasChecked}
                  onToggle={() => toggle(perm.id)}
                />
              );
            })
          )}
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isDirty} isLoading={isSubmitting}>
            {isDirty ? `Save ${selectedIds.size} permission${selectedIds.size === 1 ? "" : "s"}` : "No changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
