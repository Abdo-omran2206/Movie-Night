import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PageType = "Home" | "Explore" | "Search" | "Bookmark" | "Account";
type MoodType = "Guest" | "Account";

type StoreType = {
  page: PageType;
  setPage: (page: PageType) => void;
};


type UserMood = {
  mood: MoodType;
  setMood: (page: MoodType) => void;
};

type UserState = {
  user: any;
  setUser: (user: any) => void;
};

type Website = {
  webSiteUrl: string;
};

// Zustand store with persistence
export const useStore = create<
  StoreType & UserMood & UserState & Website
>()(
  persist(
    (set) => ({
      page: "Home",
      setPage: (page: PageType) => set({ page }),

      // User Session
      user: null,
      setUser: (user: any) => set({ user }),


      mood: "Guest",
      setMood: (mood: MoodType) => set({ mood }),

      webSiteUrl: "https://abdo-omran2206.github.io/Movie-Night",
    }),
    {
      name: "movie-night-user-data", // New more descriptive name
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist these specific fields
        user: state.user,
        mood: state.mood,
      }),
    },
  ),
);
