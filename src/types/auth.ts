import type { Timestamp } from "firebase/firestore";

export type AuthRole = "client" | "superadmin" | "admin" | "freelancer";
export type StaffRole = Exclude<AuthRole, "client">;
export type UserGender = "female" | "male" | "non_binary" | "prefer_not_to_say" | "";
export type UserStatus = "active" | "inactive" | "lost";
export type FeatureAccess = Record<string, boolean>;

export interface AuthProfile {
  id: string;
  uid: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  recovery_email?: string;
  gender?: UserGender;
  phone_number?: string;
  company_name?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  fullName: string;
  role: AuthRole;
  feature_access?: FeatureAccess;
  is_active: boolean;
  staffRole?: StaffRole;
  status: UserStatus;
  job_title?: string;
  teamMemberId?: string;
  teamId?: string;
  clientId?: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  recoveryEmail?: string;
  newsletterPreferences: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface AuthProfileUpdateInput {
  email?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  recovery_email?: string;
  gender?: UserGender;
  phone_number?: string;
  company_name?: string;
  feature_access?: FeatureAccess;
  is_active?: boolean;
  status?: UserStatus;
  job_title?: string;
  newsletterPreferences?: boolean;
  fullName?: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  recoveryEmail?: string;
}
