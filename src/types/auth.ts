import type { Timestamp } from "firebase/firestore";

export type AuthRole = "client" | "superadmin" | "admin" | "freelancer" | "team";
export type StaffRole = Exclude<AuthRole, "client">;
export type FeatureAccess = Record<string, boolean>;

export interface AuthProfile {
  id: string;
  uid: string;
  email: string;
  fullName: string;
  role: AuthRole;
  staffRole?: StaffRole;
  needsPasswordChange?: boolean;
  createdAt?: Timestamp;
  status?: "active" | "inactive" | "lost";
  newsletterPreferences?: boolean;
  featureAccess?: FeatureAccess;
  isActive?: boolean;
  firstName?: string;
  lastName?: string;
  recoveryEmail?: string;
  gender?: string;
  phoneNumber?: string;
  companyName?: string;
  updatedAt?: Timestamp;
  jobTitle?: string;
}

export interface AuthProfileUpdateInput {
  email?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  recoveryEmail?: string;
  gender?: string;
  phoneNumber?: string;
  companyName?: string;
  featureAccess?: FeatureAccess;
  isActive?: boolean;
  status?: "active" | "inactive" | "lost";
  jobTitle?: string;
  newsletterPreferences?: boolean;
}
