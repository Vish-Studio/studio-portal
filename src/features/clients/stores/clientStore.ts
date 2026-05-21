import { create } from 'zustand';
export type { Client, ClientStatus } from '../types';
import type { Client, ClientStatus } from '../types';
import { clientsService, type ClientCreateResult } from '../services/clientService';

export interface ClientInput {
  fullName:           string;
  companyName?:       string;
  email:              string;
  phone?:             string;
  status?:            ClientStatus;
  temporaryPassword?: string;
}

interface ClientsState {
  clients:          Client[];
  loading:          boolean;
  ready:            boolean;
  error:            string | null;
  setClients:       (clients: Client[]) => void;
  subscribeClients: () => () => void;
  addClient:        (input: ClientInput) => Promise<ClientCreateResult | undefined>;
  updateClient:     (id: string, updates: Partial<ClientInput>) => Promise<void>;
  removeClient:     (id: string) => Promise<void>;
}

export const useClientsStore = create<ClientsState>((set) => ({
  clients: [],
  loading: false,
  ready:   false,
  error:   null,

  setClients: (clients) => set({ clients, ready: true }),

  subscribeClients: () => {
    set({ loading: true, error: null });
    return clientsService.subscribeToClients(
      clients => set({ clients, loading: false, ready: true, error: null }),
      error => set({ clients: [], loading: false, ready: true, error: error.message }),
    );
  },

  addClient: async (input) => {
    return clientsService.createClient(input);
  },

  updateClient: async (id, updates) => {
    await clientsService.updateClient(id, updates);
  },

  removeClient: async (id) => {
    await clientsService.deleteClient(id);
  },
}));
