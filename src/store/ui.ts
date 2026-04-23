import { create } from "zustand";

interface UIState {
  /** Current global search query — read by any page that has a table. */
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  clearSearch: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),
  clearSearch: () => set({ searchQuery: "" }),
}));
