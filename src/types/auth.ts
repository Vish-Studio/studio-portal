import type { Timestamp } from 'firebase/firestore';

export type AuthRole = 'admin' | 'client';

export interface AuthProfile {
  uid: string;
  email: string;
  displayName: string;
  role: AuthRole;
  status: 'active' | 'inactive' | 'prospect' | 'agreed' | 'lost';
  clientId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
