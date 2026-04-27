import { create } from "zustand";
import type { AuthUser } from "@/types";
import { onAuthStateChanged, signIn, signOut, signUp } from "@/lib/auth";

type AuthState = {
  user: AuthUser | null;
  initialized: boolean;
  loading: boolean;
  error: string | null;
  init: () => () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,
  loading: false,
  error: null,

  init: () => {
    return onAuthStateChanged((user) => {
      set({ user, initialized: true });
    });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = await signIn(email, password);
      set({ user, loading: false });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Login failed";
      set({ loading: false, error: msg });
      throw e;
    }
  },

  register: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = await signUp(email, password);
      set({ user, loading: false });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Sign-up failed";
      set({ loading: false, error: msg });
      throw e;
    }
  },

  logout: async () => {
    await signOut();
    set({ user: null });
  },

  clearError: () => set({ error: null }),
}));
