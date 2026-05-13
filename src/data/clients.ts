export type ClientStatus = 'active' | 'inactive' | 'lost';

export interface Client {
  id: string;
  displayName: string;
  companyName?: string;
  email: string;
  phone?: string;
  role: 'client';
  status: ClientStatus;
  createdAt?: { toMillis: () => number; toDate: () => Date };
}

// Demo data lives in seed.ts — re-exported here for Storybook compatibility
export { DEMO_CLIENTS, DEMO_RECENT_CLIENTS } from './seed';
