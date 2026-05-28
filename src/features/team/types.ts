export type TeamAccessRole = "superadmin" | "admin" | "freelancer" | "team";
export type TeamWorkStatus = "working" | "fired" | "on-leave";
export type TeamSalaryType = "monthly" | "per-project";

export interface TeamMember {
  id: string;
  /** Display name — primary field used by UI components */
  name:       string;
  /** Legacy snake_case alias; kept for Firestore compatibility */
  full_name?: string;
  first_name?: string;
  last_name?:  string;
  user_id?:   string | null;
  userId?:    string | null;
  role:       string;   // job title / position
  job_title?: string;
  accessRole?: TeamAccessRole;
  email:       string;
  phone?:      string;
  phone_number?: string;
  isOnline?:   boolean;
  is_online?:  boolean;
  lastOnlineAt?: { toMillis: () => number; toDate: () => Date } | number | string;
  last_online_at?: { toMillis: () => number; toDate: () => Date } | number | string;
  salaryAmount?: number;
  salary_amount?: number;
  salaryType?: TeamSalaryType;
  salary_type?: TeamSalaryType;
  assignedProjectId: string | null;
  status?:     TeamWorkStatus | "active" | "inactive" | "lost";
  is_active?:  boolean;
  createdAt?:  { toMillis: () => number; toDate: () => Date };
  created_at?: { toMillis: () => number; toDate: () => Date };
  updatedAt?:  { toMillis: () => number; toDate: () => Date };
  updated_at?: { toMillis: () => number; toDate: () => Date };
}

export interface TeamProject {
  id: string;
  name: string;
  client: string;
  status: "active" | "completed" | "paused";
  createdAt?: number;
}

export const AVATAR_COLORS: Record<
  string,
  { bg: string; text: string; header: string }
> = {
  a: { bg: "bg-violet-500", text: "text-violet-600", header: "bg-violet-100" },
  b: { bg: "bg-blue-500", text: "text-blue-600", header: "bg-blue-100" },
  c: {
    bg: "bg-emerald-500",
    text: "text-emerald-600",
    header: "bg-emerald-100",
  },
  d: { bg: "bg-orange-500", text: "text-orange-600", header: "bg-orange-100" },
  e: { bg: "bg-pink-500", text: "text-pink-600", header: "bg-pink-100" },
  f: { bg: "bg-cyan-500", text: "text-cyan-600", header: "bg-cyan-100" },
  g: { bg: "bg-amber-500", text: "text-amber-600", header: "bg-amber-100" },
  h: { bg: "bg-rose-500", text: "text-rose-600", header: "bg-rose-100" },
};

const COLOR_KEYS = Object.keys(AVATAR_COLORS);

export function getMemberColors(id: string) {
  const key = COLOR_KEYS[id.charCodeAt(id.length - 1) % COLOR_KEYS.length];
  return AVATAR_COLORS[key];
}
