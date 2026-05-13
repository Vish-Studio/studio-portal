import { create } from 'zustand';
export type { Client, ClientStatus } from '../data/clients';
import type { Client } from '../data/clients';
import { clientsService, type ClientInput } from '../services/firebase/clients-service';

interface ClientsState {
  clients: Client[];
  loading: boolean;
  ready: boolean;
  error: string | null;
  unsubscribe?: () => void;
  setClients: (clients: Client[]) => void;
  subscribeClients: () => () => void;
  addClient: (client: ClientInput) => Promise<string | undefined>;
  updateClient: (id: string, updates: Partial<ClientInput>) => Promise<void>;
  removeClient: (id: string) => Promise<void>;
}

export const useClientsStore = create<ClientsState>((set) => ({
  clients: [], // hydrated on app start via initStores()
  loading: false,
  ready: false,
  error: null,
  unsubscribe: undefined,

  setClients: (clients) => set({ clients }),

  subscribeClients: () => {
    const currentUnsubscribe = useClientsStore.getState().unsubscribe;
    if (currentUnsubscribe) return currentUnsubscribe;

    set({ clients: [], loading: true, ready: false, error: null });

    const firestoreUnsubscribe = clientsService.subscribeToClients(
      clients => set({ clients, loading: false, ready: true, error: null }),
      error => set({ clients: [], loading: false, ready: true, error: error.message }),
    );

    const unsubscribe = () => {
      firestoreUnsubscribe();
      if (useClientsStore.getState().unsubscribe === unsubscribe) {
        set({ unsubscribe: undefined });
      }
    };

    set({ unsubscribe });
    return unsubscribe;
  },

  addClient: async (client) => {
    set({ loading: true, error: null });

    try {
      const id = await clientsService.createClient(client);
      set({ loading: false });
      return id;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to add client.';
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  updateClient: async (id, updates) => {
    set({ loading: true, error: null });

    try {
      await clientsService.updateClient(id, updates);
      set({ loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update client.';
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  removeClient: async (id) => {
    set({ loading: true, error: null });

    try {
      await clientsService.deleteClient(id);
      set({ loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete client.';
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
}));
