export interface Client {
  id:          string;
  userId?:     string | null;
  companyName: string;
  fullName:    string;
  email:       string;
  role?:       "client";
  phone?:      string;
  website?:    string;
  industry?:   string;
  location?:   string;
  companySize?: string;
  isOnline?:   boolean;
  lastOnlineAt?: { toMillis: () => number; toDate: () => Date } | number | string;
  status?:     ClientStatus;
  avatarColor?: string;
  createdAt?:  { toMillis: () => number; toDate: () => Date };
}

/** Kept for backward compat with existing UI filter tabs and dropdowns. */
export type ClientStatus = "active" | "inactive" | "lost";

export interface ClientInput {
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  status?: ClientStatus;
  temporaryPassword?: string;
}

export interface ClientCreateResult {
  id: string;
  email: string;
  temporaryPassword: string;
}
