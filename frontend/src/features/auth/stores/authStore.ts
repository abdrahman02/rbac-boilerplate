import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthenticatedUser } from "@/features/auth/types";

interface AuthState {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthenticatedUser | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: user !== null }),
      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "rbac-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
