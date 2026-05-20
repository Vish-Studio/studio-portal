export type ClientStatus = "active" | "inactive" | "lost";

export interface Client {
  id: string;
  userId?: string | null;
  user_id?: string | null;
  fullName: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  companyName?: string;
  company_name?: string;
  email: string;
  phone?: string;
  phone_number?: string;
  role: "client";
  status: ClientStatus;
  is_active?: boolean;
  createdAt?: { toMillis: () => number; toDate: () => Date };
  created_at?: { toMillis: () => number; toDate: () => Date };
  updatedAt?: { toMillis: () => number; toDate: () => Date };
  updated_at?: { toMillis: () => number; toDate: () => Date };
}
