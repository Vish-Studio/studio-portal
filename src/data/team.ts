export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  assignedProjectId: string | null;
}

export interface TeamProject {
  id: string;
  name: string;
  client: string;
  status: "active" | "completed" | "paused";
}

export const AVATAR_COLORS: Record<string, { bg: string; text: string; header: string }> = {
  a: { bg: "bg-violet-500", text: "text-violet-600", header: "bg-violet-100" },
  b: { bg: "bg-blue-500", text: "text-blue-600", header: "bg-blue-100" },
  c: { bg: "bg-emerald-500", text: "text-emerald-600", header: "bg-emerald-100" },
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

export const DEMO_PROJECTS: TeamProject[] = [
  { id: "p1", name: "Brand Refresh", client: "Acme Corp", status: "active" },
  { id: "p2", name: "E-Commerce Redesign", client: "Globex", status: "active" },
  { id: "p3", name: "Mobile App MVP", client: "Initech", status: "active" },
  { id: "p4", name: "Marketing Site", client: "Stark Industries", status: "paused" },
  { id: "p5", name: "Dashboard Analytics", client: "Umbrella Ltd", status: "active" },
];

export const DEMO_MEMBERS: TeamMember[] = [
  { id: "m1", name: "Aisha Patel", role: "Lead Designer", email: "aisha@studio.com", assignedProjectId: "p1" },
  { id: "m2", name: "Jordan Clarke", role: "Frontend Developer", email: "jordan@studio.com", assignedProjectId: "p2" },
  { id: "m3", name: "Mei Lin", role: "UX Researcher", email: "mei@studio.com", assignedProjectId: "p3" },
  { id: "m4", name: "Samuel Osei", role: "Full-Stack Developer", email: "samuel@studio.com", assignedProjectId: "p2" },
  { id: "m5", name: "Priya Nair", role: "Project Manager", email: "priya@studio.com", assignedProjectId: "p5" },
  { id: "m6", name: "Tom Eriksen", role: "Motion Designer", email: "tom@studio.com", assignedProjectId: null },
  { id: "m7", name: "Lucia Romero", role: "Brand Strategist", email: "lucia@studio.com", assignedProjectId: "p1" },
  { id: "m8", name: "Dev Sharma", role: "Backend Developer", email: "dev@studio.com", assignedProjectId: "p4" },
];
