'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Input, FormField } from '@/components/ui'
import { useCreateUser, useUpdateUser } from '@/features/users/hooks/useUsers'
import { getErrorMessage } from '@/shared/lib/api-error'
import type { UserWithRoles } from '@/shared/types'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().optional(),
})

type FormInput = z.infer<typeof schema>

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  user?: UserWithRoles | null
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const isEditing = !!user
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (isOpen) {
      reset(isEditing ? { name: user.name, email: user.email, password: '' } : {})
    }
  }, [isOpen, isEditing, user, reset])

  const onSubmit = async (data: FormInput) => {
    if (!isEditing && !data.password) {
      setError('password', { message: 'Password is required' })
      return
    }
    if (!isEditing && data.password && data.password.length < 8) {
      setError('password', { message: 'Password must be at least 8 characters' })
      return
    }
    try {
      if (isEditing) {
        await updateUser.mutateAsync({ id: user.id, payload: { name: data.name, email: data.email } })
      } else {
        await createUser.mutateAsync({ name: data.name, email: data.email, password: data.password! })
      }
      onClose()
    } catch (err) {
      setError('root', { message: getErrorMessage(err) })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit User' : 'Create User'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-800">{errors.root.message}</p>
          </div>
        )}

        <FormField label="Name" error={errors.name?.message}>
          <Input {...register('name')} placeholder="John Doe" error={errors.name?.message} />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <Input
            type="email"
            {...register('email')}
            placeholder="john@example.com"
            error={errors.email?.message}
          />
        </FormField>

        {!isEditing && (
          <FormField label="Password" error={errors.password?.message}>
            <Input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              error={errors.password?.message}
            />
          </FormField>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create User'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
