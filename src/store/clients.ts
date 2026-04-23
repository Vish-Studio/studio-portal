import { create } from "zustand";
import { DEMO_CLIENTS } from "../data/clients";
export type { Client, ClientStatus } from "../data/clients";

import type { Client } from "../data/clients";

interface ClientsState {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Omit<Client, "id" | "role" | "createdAt">>) => void;
  removeClient: (id: string) => void;
}

export const useClientsStore = create<ClientsState>((set) => ({
  clients: DEMO_CLIENTS,

  setClients: (clients) => set({ clients }),

  addClient: (client) =>
    set((state) => ({ clients: [client, ...state.clients] })),

  updateClient: (id, updates) =>
    set((state) => ({
      clients: state.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  removeClient: (id) =>
    set((state) => ({ clients: state.clients.filter((c) => c.id !== id) })),
}));
