import type { Timestamp } from 'firebase/firestore';

export type AuthRole = 'admin' | 'client';
export type StaffRole = 'superadmin' | 'admin' | 'freelancer';

export interface AuthProfile {
  uid: string;
  email: string;
  displayName: string;
  role: AuthRole;
  staffRole?: StaffRole;
  status: 'active' | 'inactive' | 'prospect' | 'agreed' | 'lost';
  teamMemberId?: string;
  clientId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
