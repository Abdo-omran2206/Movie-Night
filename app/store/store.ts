import { create } from "zustand";

type PageType = "Home" | "Explore" | "Search" | "Bookmark";

type StoreType = {
  page: PageType;
  setPage: (page: PageType) => void;
};

export const useStore = create<StoreType>((set) => ({
  page: "Home",
  setPage: (page) => set({ page }),
}));
