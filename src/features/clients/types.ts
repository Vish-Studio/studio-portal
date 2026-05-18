export type ClientStatus = 'active' | 'inactive' | 'lost';

export interface Client {
  id: string;
  userId?: string | null;
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  role: 'client';
  status: ClientStatus;
  createdAt?: { toMillis: () => number; toDate: () => Date };
}

