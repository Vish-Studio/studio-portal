import { create } from "zustand";
import { DEMO_CLIENTS } from "../data/clients";
export type { Client } from "../data/clients";

import type { Client } from "../data/clients";

interface ClientsState {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
}

export const useClientsStore = create<ClientsState>((set) => ({
  clients: DEMO_CLIENTS,

  setClients: (clients) => set({ clients }),

  addClient: (client) =>
    set((state) => ({ clients: [client, ...state.clients] })),
}));
