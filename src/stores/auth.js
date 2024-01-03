import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    user: {
      name: "",
      level: "",
      email: "",
      avatar: "",
    },
  }),
  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
  },
  actions: {
    setToken(token) {
      localStorage.setItem("token", token);
      this.token = token;
    },
    setUser(user) {
      this.user = user;
    },
  },
});
