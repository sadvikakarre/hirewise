import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user") || "null"),

  login: (tokenData) => {
    localStorage.setItem("token", tokenData.access_token);
    const user = {
      id: tokenData.user_id,
      name: tokenData.name,
      role: tokenData.role,
    };
    localStorage.setItem("user", JSON.stringify(user));
    set({ token: tokenData.access_token, user });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
