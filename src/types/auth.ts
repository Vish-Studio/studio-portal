import type { Timestamp } from 'firebase/firestore';

export type AuthRole = 'superadmin' | 'admin' | 'freelancer' | 'user';
export type StaffRole = Exclude<AuthRole, 'user'>;

export interface NewsletterPreferences {
  marketingEmails: boolean;
  productUpdates: boolean;
  weeklyDigest: boolean;
  securityAlerts: boolean;
}

export interface AuthProfile {
  uid: string;
  email: string;
  displayName: string;
  role: AuthRole;
  staffRole?: StaffRole;
  status: 'active' | 'inactive' | 'prospect' | 'agreed' | 'lost';
  teamMemberId?: string;
  teamId?: string;
  clientId?: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  recoveryEmail?: string;
  newsletterPreferences?: NewsletterPreferences;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface AuthProfileUpdateInput {
  displayName?: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  recoveryEmail?: string;
  newsletterPreferences?: NewsletterPreferences;
}
