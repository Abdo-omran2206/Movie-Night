import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
}
interface UserSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
}
interface UserState {
  user: User | null;

  usersession: UserSession | null;

  setUserSession: (usersession: UserSession | null) => void;
  setUser: (user: User | null) => void;

  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      usersession: null,

      setUserSession: (usersession) => set({ usersession }),
      setUser: (user) => set({ user }),

      clearUser: () => set({ user: null }),
    }),
    {
      name: "movie-night-user-store",
    },
  ),
);
