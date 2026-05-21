'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui'
import { PermissionGate } from '@/shared/components/guard/PermissionGate'
import { usePermissionList, useDeletePermission } from '@/features/permissions/hooks/usePermissionsCrud'
import { PermissionModal } from '@/features/permissions/components/PermissionModal'
import { getErrorMessage } from '@/shared/lib/api-error'
import type { Permission } from '@/shared/types'

export default function PermissionsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { data: permissions = [], isLoading } = usePermissionList()
  const deletePermission = useDeletePermission()

  const openCreate = () => {
    setSelectedPermission(null)
    setModalOpen(true)
  }

  const openEdit = (permission: Permission) => {
    setSelectedPermission(permission)
    setModalOpen(true)
  }

  const handleDelete = async (permission: Permission) => {
    if (!confirm(`Delete permission "${permission.name}"?`)) return
    setDeleteError(null)
    try {
      await deletePermission.mutateAsync(permission.id)
    } catch (err) {
      setDeleteError(getErrorMessage(err))
    }
  }

  const grouped = permissions.reduce<Record<string, Permission[]>>((acc, perm) => {
    const resource = perm.name.split(':')[0] ?? 'other'
    if (!acc[resource]) acc[resource] = []
    acc[resource].push(perm)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Permissions</h1>
          <p className="mt-1 text-sm text-gray-500">{permissions.length} total permissions</p>
        </div>
        <PermissionGate permission="permissions:create">
          <Button onClick={openCreate}>+ Create Permission</Button>
        </PermissionGate>
      </div>

      {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        Object.entries(grouped).map(([resource, perms]) => (
          <div
            key={resource}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <div className="border-b bg-gray-50 px-6 py-3">
              <h3 className="font-medium capitalize text-gray-700">{resource}</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  {['Permission', 'Description', 'Created', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {perms.map((perm) => (
                  <tr key={perm.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">{perm.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{perm.description ?? '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(perm.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <PermissionGate permission="permissions:update">
                          <Button size="sm" variant="secondary" onClick={() => openEdit(perm)}>
                            Edit
                          </Button>
                        </PermissionGate>
                        <PermissionGate permission="permissions:delete">
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(perm)}
                            isLoading={deletePermission.isPending}
                          >
                            Delete
                          </Button>
                        </PermissionGate>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      <PermissionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        permission={selectedPermission}
      />
    </div>
  )
}
