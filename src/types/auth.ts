import type { Timestamp } from "firebase/firestore";

export type AuthRole = "client" | "superadmin" | "admin" | "freelancer" | "team";
export type StaffRole = Exclude<AuthRole, "client">;
export type FeatureAccess = Record<string, boolean>;

export interface AuthProfile {
  id: string;
  uid: string;
  email: string;
  name: string;
  fullName: string;
  role: AuthRole;
  staffRole?: StaffRole;
  needsPasswordChange?: boolean;
  createdAt?: Timestamp;
  feature_access?: FeatureAccess;
  is_active?: boolean;
  status?: "active" | "inactive" | "lost";
  newsletterPreferences?: boolean;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  recovery_email?: string;
  gender?: string;
  phone_number?: string;
  company_name?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  job_title?: string;
  teamMemberId?: string;
  teamId?: string;
  clientId?: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  recoveryEmail?: string;
  updatedAt?: Timestamp;
}

export interface AuthProfileUpdateInput {
  email?: string;
  name?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  recovery_email?: string;
  gender?: string;
  phone_number?: string;
  company_name?: string;
  feature_access?: FeatureAccess;
  is_active?: boolean;
  status?: "active" | "inactive" | "lost";
  job_title?: string;
  newsletterPreferences?: boolean;
  fullName?: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  recoveryEmail?: string;
}
