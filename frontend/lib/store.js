import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  role: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setRole: (role) => set({ role }),
  setAuth: (user, token) =>
    set({
      user,
      token,
      role: user?.role || null,
      isAuthenticated: true,
    }),
  logout: () =>
    set({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
    }),
  initialize: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      
      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          console.log("📦 Loaded user from localStorage:", {
            hasId: !!parsedUser._id,
            hasEmail: !!parsedUser.email,
            keys: Object.keys(parsedUser)
          });
          
          set({
            token,
            user: parsedUser,
            role: parsedUser?.role || null,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("❌ Failed to parse user from localStorage:", error);
        }
      } else {
        console.log("⚠️  No stored auth credentials found");
      }
    }
  },
}));
