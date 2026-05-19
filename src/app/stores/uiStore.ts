import { create } from "zustand";

export type ToastStatus = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  status: ToastStatus;
  title: string;
  message?: string;
}

interface ActiveOperation {
  id: string;
  label: string;
}

interface UIState {
  /** Current global search query — read by any page that has a table. */
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  clearSearch: () => void;

  /** Sidebar open/collapsed state — persisted across route changes. */
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;

  /** Global feedback state for app-level async actions. */
  activeOperations: ActiveOperation[];
  beginOperation: (label?: string) => string;
  endOperation: (id: string) => void;

  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => string;
  dismissToast: (id: string) => void;
}

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const useUIStore = create<UIState>((set) => ({
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),
  clearSearch: () => set({ searchQuery: "" }),

  isSidebarOpen: true,
  setIsSidebarOpen: (open) => set({ isSidebarOpen: open }),

  activeOperations: [],
  beginOperation: (label = "Saving changes") => {
    const id = createId("operation");
    set((state) => ({
      activeOperations: [...state.activeOperations, { id, label }],
    }));
    return id;
  },
  endOperation: (id) => set((state) => ({
    activeOperations: state.activeOperations.filter(operation => operation.id !== id),
  })),

  toasts: [],
  showToast: (toast) => {
    const id = createId("toast");
    set((state) => ({
      toasts: [...state.toasts, { id, ...toast }].slice(-4),
    }));
    return id;
  },
  dismissToast: (id) => set((state) => ({
    toasts: state.toasts.filter(toast => toast.id !== id),
  })),
}));
