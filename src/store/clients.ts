import { create } from 'zustand';
export type { Client, ClientStatus } from '../data/clients';
import type { Client } from '../data/clients';

interface ClientsState {
  clients: Client[];
  setClients:    (clients: Client[]) => void;
  addClient:     (client: Client) => void;
  updateClient:  (id: string, updates: Partial<Omit<Client, 'id' | 'role' | 'createdAt'>>) => void;
  removeClient:  (id: string) => void;
}

export const useClientsStore = create<ClientsState>((set) => ({
  clients: [], // hydrated on app start via initStores()

  setClients: (clients) => set({ clients }),

  addClient: (client) =>
    set((s) => ({ clients: [client, ...s.clients] })),

  updateClient: (id, updates) =>
    set((s) => ({
      clients: s.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  removeClient: (id) =>
    set((s) => ({ clients: s.clients.filter((c) => c.id !== id) })),
}));
