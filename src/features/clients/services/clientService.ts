import type { Client } from '../types';

export interface ClientInput {
  fullName?: string;
  name?: string;
  email: string;
  companyName?: string;
  phone?: string;
  website?: string;
  industry?: string;
  location?: string;
  companySize?: string;
  status?: Client['status'];
  temporaryPassword?: string;
}

export interface ClientCreateResult {
  id: string;
  email: string;
  temporaryPassword: string;
}

export const clientsService = {
  subscribeToClients() {
    return () => undefined;
  },
};
