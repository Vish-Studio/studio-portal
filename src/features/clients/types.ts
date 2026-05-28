/**
 * Firestore schema (flat, root-level, no duplicates):
 *   /clients/{uid}  → { id, companyName }
 *   /users/{uid}    → { uid, name, email, role, needsPasswordChange }
 *
 * The Client interface is the *joined* shape used in the UI.
 * The service layer reads /users.name and exposes it as fullName so
 * existing components work without modification.
 */
export interface Client {
  /** Firebase Auth UID — Firestore doc ID in /clients and /users */
  id:          string;
  userId?:     string | null;
  /** From /clients/{uid}.companyName */
  companyName: string;
  /**
   * Display name — sourced from /users/{uid}.name at read time.
   * Used by all existing UI components.
   */
  fullName:    string;
  /** From /users/{uid}.email */
  email:       string;
  /** Optional legacy / UI-compat fields — not stored in the new Firestore schema */
  role?:       "client";
  phone?:      string;
  website?:    string;
  industry?:   string;
  location?:   string;
  companySize?: string;
  isOnline?:   boolean;
  lastOnlineAt?: { toMillis: () => number; toDate: () => Date } | number | string;
  status?:     ClientStatus;
  createdAt?:  { toMillis: () => number; toDate: () => Date };
}

/** Kept for backward compat with existing UI filter tabs and dropdowns. */
export type ClientStatus = "active" | "inactive" | "lost";
