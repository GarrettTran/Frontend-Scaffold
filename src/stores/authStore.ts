import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type User = {
    id: string;
    name: string;
    address: string
}

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user:  User | null;
  // actions
  signIn: (user: User) => void;
  signOut: () => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      signIn: (user) => set({ user, isAuthenticated: true }),
      signOut: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, isAuthenticated: false });
      },
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
