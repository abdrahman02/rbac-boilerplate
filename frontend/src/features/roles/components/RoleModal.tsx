'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Input, FormField } from '@/components/ui'
import { useCreateRole, useUpdateRole } from '@/features/roles/hooks/useRoles'
import { getErrorMessage } from '@/shared/lib/api-error'
import type { RoleWithPermissions } from '@/shared/types'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
})

type FormInput = z.infer<typeof schema>

interface RoleModalProps {
  isOpen: boolean
  onClose: () => void
  role?: RoleWithPermissions | null
}

export function RoleModal({ isOpen, onClose, role }: RoleModalProps) {
  const isEditing = !!role
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (isOpen) {
      reset(isEditing ? { name: role.name, description: role.description ?? '' } : {})
    }
  }, [isOpen, isEditing, role, reset])

  const onSubmit = async (data: FormInput) => {
    try {
      if (isEditing) {
        await updateRole.mutateAsync({ id: role.id, payload: data })
      } else {
        await createRole.mutateAsync(data)
      }
      onClose()
    } catch (err) {
      setError('root', { message: getErrorMessage(err) })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Role' : 'Create Role'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-800">{errors.root.message}</p>
          </div>
        )}

        <FormField label="Name" error={errors.name?.message}>
          <Input {...register('name')} placeholder="admin" error={errors.name?.message} />
        </FormField>

        <FormField label="Description" error={errors.description?.message}>
          <Input
            {...register('description')}
            placeholder="Administrator role"
            error={errors.description?.message}
          />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Role'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
