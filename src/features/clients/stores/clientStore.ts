import { create } from 'zustand';
export type { Client, ClientStatus } from '../types';
import type { Client, ClientStatus } from '../types';
import type { ClientCreateResult } from '../services/clientService';
import { randomAvatarTone } from '@/src/shared/components/avatar/avatar';

export interface ClientInput {
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  status?: ClientStatus;
  temporaryPassword?: string;
}

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
    return { id, email, temporaryPassword };
  },

  updateClient: async (id, updates) => {
    set(state => ({
      clients: state.clients.map(client => (
        client.id === id
          ? {
              ...client,
              ...updates,
              fullName: updates.fullName?.trim() ?? client.fullName,
              companyName: updates.companyName?.trim() ?? client.companyName,
              email: updates.email?.trim().toLowerCase() ?? client.email,
              phone: updates.phone?.trim() ?? client.phone,
              status: updates.status ?? client.status,
            }
          : client
      )),
    }));
  },

  removeClient: async (id) => {
    set(state => ({ clients: state.clients.filter(client => client.id !== id) }));
  },
}));
