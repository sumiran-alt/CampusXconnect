import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setAuth: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),
  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),
  initialize: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        set({
          token,
          user: JSON.parse(user),
          isAuthenticated: true,
        });
      }
    }
  },
}));
