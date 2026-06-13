import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userName: string;
  userId: string;
  setUser: (name: string, id: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userName: "",
      userId: "",
      setUser: (name, id) => set({ userName: name, userId: id }),
      clearUser: () => set({ userName: "", userId: "" }),
    }),
    {
      name: 'movie-night-user-store',
    }
  )
);
