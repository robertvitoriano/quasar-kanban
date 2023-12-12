import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
  }),
  getters: {
    getToken: (state) => state.token,
    getLevel: (state) => state.level,
  },
  actions: {
    setToken(token) {
      localStorage.setItem("token", token);
      this.token = token;
    },
    setLevel(level) {
      localStorage.setItem("level", level);
      this.level = level;
    },
  },
});
