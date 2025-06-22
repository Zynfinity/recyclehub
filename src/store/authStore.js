import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
    user: null,
    session: null,

    setUser: (user) => set({ user }),
    setSession: (session) => set({ session })
}));
