import { create } from 'zustand';
export type { Client, ClientStatus } from '../types';
import type { Client, ClientCreateResult, ClientInput } from '../types';
import { randomAvatarTone } from '@/src/shared/components/avatar/avatar';
import { useUsersStore } from '@/src/features/users';

interface ClientsState {
  clients: Client[];
  loading: boolean;
  ready: boolean;
  error: string | null;
  setClients: (clients: Client[]) => void;
  subscribeClients: () => () => void;
  addClient: (input: ClientInput) => Promise<ClientCreateResult | undefined>;
  updateClient: (id: string, updates: Partial<ClientInput>) => Promise<void>;
  removeClient: (id: string) => Promise<void>;
}

const localId = () => `client_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const timestamp = () => ({ toMillis: () => Date.now(), toDate: () => new Date() });

export const useClientsStore = create<ClientsState>((set) => ({
  clients: [],
  loading: false,
  ready: false,
  error: null,

  setClients: (clients) => set({ clients, ready: true }),

  subscribeClients: () => {
    set({ loading: false, ready: true, error: null });
    return () => undefined;
  },

  addClient: async (input) => {
    const id = localId();
    const email = input.email.trim().toLowerCase();
    const temporaryPassword = input.temporaryPassword?.trim() || 'local-password';
    const client: Client = {
      id,
      userId: id,
      fullName: input.fullName.trim(),
      companyName: input.companyName?.trim() ?? '',
      email,
      phone: input.phone?.trim() ?? '',
      role: 'client',
      status: input.status ?? 'active',
      avatarColor: randomAvatarTone(),
      createdAt: timestamp(),
    };
    set(state => ({ clients: [client, ...state.clients], ready: true }));
    useUsersStore.getState().upsertUser({
      sourceId: id,
      kind: 'client',
      name: client.fullName,
      email: client.email,
      authRole: 'user',
      roleLabel: 'Client',
      accountStatus: client.status,
      temporaryPassword,
    });
    return { id, email, temporaryPassword };
  },

  updateClient: async (id, updates) => {
    let syncedClient: Client | undefined;
    set(state => ({
      clients: state.clients.map(client => {
        if (client.id !== id) return client;
        syncedClient = {
          ...client,
          ...updates,
          fullName: updates.fullName?.trim() ?? client.fullName,
          companyName: updates.companyName?.trim() ?? client.companyName,
          email: updates.email?.trim().toLowerCase() ?? client.email,
          phone: updates.phone?.trim() ?? client.phone,
          status: updates.status ?? client.status,
        };
        return syncedClient;
      }),
    }));
    if (syncedClient) {
      useUsersStore.getState().upsertUser({
        sourceId: syncedClient.id,
        kind: 'client',
        name: syncedClient.fullName,
        email: syncedClient.email,
        authRole: 'user',
        roleLabel: 'Client',
        accountStatus: syncedClient.status,
      });
    }
  },

  removeClient: async (id) => {
    set(state => ({ clients: state.clients.filter(client => client.id !== id) }));
    useUsersStore.getState().removeUserBySource('client', id);
  },
}));
