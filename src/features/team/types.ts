export type TeamAccessRole = "superadmin" | "admin" | "freelancer" | "team";
export type TeamWorkStatus = "working" | "fired" | "on-leave";
export type TeamSalaryType = "monthly" | "per-project";

export interface TeamMember {
  id: string;
  /** Display name — primary field used by UI components */
  name:       string;
  userId?:    string | null;
  role:       string;   // job title / position
  accessRole?: TeamAccessRole;
  email:       string;
  phone?:      string;
  isOnline?:   boolean;
  lastOnlineAt?: { toMillis: () => number; toDate: () => Date } | number | string;
  salaryAmount?: number;
  salaryType?: TeamSalaryType;
  assignedProjectId: string | null;
  status?:     TeamWorkStatus | "active" | "inactive" | "lost";
  avatarColor?: string;
  createdAt?:  { toMillis: () => number; toDate: () => Date };
  updatedAt?:  { toMillis: () => number; toDate: () => Date };
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
  a: { bg: "bg-(--color-ink)", text: "text-(--color-ink)", header: "bg-gray-100" },
  b: { bg: "bg-slate-700", text: "text-slate-700", header: "bg-slate-100" },
  c: { bg: "bg-zinc-700", text: "text-zinc-700", header: "bg-zinc-100" },
  d: { bg: "bg-lime-700", text: "text-lime-700", header: "bg-lime-100" },
};

const COLOR_KEYS = Object.keys(AVATAR_COLORS);

export function getMemberColors(id: string) {
  const key = COLOR_KEYS[id.charCodeAt(id.length - 1) % COLOR_KEYS.length];
  return AVATAR_COLORS[key];
}
