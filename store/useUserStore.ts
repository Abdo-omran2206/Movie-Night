import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  jwt:string
}

interface UserState {
  user: User | null;

  setUser: (user: User | null) => void;

  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      clearUser: () => set({ user: null }),
    }),
    {
      name: "movie-night-user-store",
    },
  ),
);
