import type { Timestamp } from "firebase/firestore";

export type AuthRole = "client" | "superadmin" | "admin" | "freelancer";
export type StaffRole = Exclude<AuthRole, "client">;

export interface NewsletterPreferences {
  marketingEmails: boolean;
  productUpdates: boolean;
  weeklyDigest: boolean;
  securityAlerts: boolean;
}

export interface AuthProfile {
  uid: string;
  email: string;
  fullName: string;
  role: AuthRole;
  staffRole?: StaffRole;
  status: "active" | "inactive" | "prospect" | "agreed" | "lost";
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
  email?: string;
  fullName?: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  recoveryEmail?: string;
  newsletterPreferences?: NewsletterPreferences;
}
