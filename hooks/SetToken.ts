import { create } from "zustand";

interface TokenState {
  initial_token: string;
  setToken: (access_token: string) => void;
}

export const SetToken = create<TokenState>((set) => ({
  initial_token: "",
  setToken(access_token) {
    set({ initial_token: access_token });
  },
}));
