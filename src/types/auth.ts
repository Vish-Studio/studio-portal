export interface LocalTimestamp {
  toMillis: () => number;
  toDate?: () => Date;
}

export type AuthRole = "user" | "admin" | "superadmin";
export type StaffRole = "admin" | "superadmin";
export type FeatureAccess = Record<string, boolean>;

export interface AuthProfile {
  id: string;
  uid: string;
  email: string;
  fullName: string;
  role: AuthRole;
  staffRole?: StaffRole;
  needsPasswordChange?: boolean;
  createdAt?: LocalTimestamp;
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
  updatedAt?: LocalTimestamp;
  jobTitle?: string;
  avatarColor?: string;
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
