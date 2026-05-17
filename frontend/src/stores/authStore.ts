import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthenticatedUser } from '@/types'

interface AuthState {
  user: AuthenticatedUser | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: AuthenticatedUser | null) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      setUser: (user) =>
        set({ user, isAuthenticated: user !== null, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      clearAuth: () =>
        set({ user: null, isAuthenticated: false, isLoading: false }),
    }),
    {
      name: 'rbac-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
