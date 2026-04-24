import { create } from "zustand";

interface UIState {
  /** Current global search query — read by any page that has a table. */
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  clearSearch: () => void;

  /** Sidebar open/collapsed state — persisted across route changes. */
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),
  clearSearch: () => set({ searchQuery: "" }),

  isSidebarOpen: true,
  setIsSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
