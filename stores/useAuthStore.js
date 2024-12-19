import { create } from "zustand";
import { api } from "../axios";
import * as SecureStore from "expo-secure-store";
import { navigate } from "../helpers";
import { stackRoutesNames } from "../routers/stackRoutesNames";

const useAuthStore = create((set) => ({
  auth: false,
  token: null,
  userInfo: null,
  login: async (form) => {
    const { token, user } = await api.POST(`/auth/login`, form);
    if (!token || !user) {
      set({ auth: false, token: null, userInfo: null });
      return;
    }

    await api.setToken({ token, user });
    set({ auth: true, token, userInfo: user });
  },
  logout: async () => {
    await api.deleteToken();
    set({ auth: false, token: null, userInfo: null });
    navigate(stackRoutesNames.LOGIN);
  },
  restoreSession: async ({ auth, token, userInfo }) => {
    const promises = [];

    if (token) promises.push(SecureStore.setItemAsync("x-token", token));
    if (userInfo)
      promises.push(SecureStore.setItemAsync("user", JSON.stringify(userInfo)));

    await Promise.all(promises);

    set({ auth, token, userInfo });
  },
}));

export default useAuthStore;
