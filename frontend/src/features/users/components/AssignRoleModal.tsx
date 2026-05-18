'use client'

import { useState } from 'react'
import { Modal, Button } from '@/components/ui'
import { useRoles } from '@/features/roles/hooks/useRoles'
import { useAssignRole, useRemoveRole } from '@/features/users/hooks/useUsers'
import { getErrorMessage } from '@/shared/lib/api-error'
import type { UserWithRoles } from '@/shared/types'

interface AssignRoleModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserWithRoles
}

export function AssignRoleModal({ isOpen, onClose, user }: AssignRoleModalProps) {
  const { data: roles = [] } = useRoles()
  const assignRole = useAssignRole()
  const removeRole = useRemoveRole()
  const [error, setError] = useState<string | null>(null)

  const handleToggle = async (roleId: number, roleName: string, hasRole: boolean) => {
    setError(null)
    try {
      if (hasRole) {
        await removeRole.mutateAsync({ userId: user.id, roleId })
      } else {
        await assignRole.mutateAsync({ userId: user.id, roleId })
      }
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const isPending = assignRole.isPending || removeRole.isPending

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assign Roles — ${user.name}`}>
      <div className="space-y-2">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {roles.map((role) => {
          const hasRole = user.roles.includes(role.name)
          return (
            <div key={role.id} className="flex items-center justify-between rounded border p-3">
              <div>
                <p className="font-medium text-gray-900">{role.name}</p>
                {role.description && (
                  <p className="text-sm text-gray-500">{role.description}</p>
                )}
              </div>
              <Button
                size="sm"
                variant={hasRole ? 'danger' : 'primary'}
                onClick={() => handleToggle(role.id, role.name, hasRole)}
                isLoading={isPending}
              >
                {hasRole ? 'Remove' : 'Assign'}
              </Button>
            </div>
          )
        })}

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  )
}
