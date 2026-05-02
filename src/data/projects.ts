// ─── Service & Package types ───────────────────────────────────────────────────

export type ServiceType = 'website' | 'software' | 'mobile-app' | 'branding' | 'logo-design';
export type PackageType = 'essentials' | 'growth' | 'premium';

export interface AccentTokens {
  bg: string;
  iconText: string;
  bar: string;
  badgeBg: string;
  badgeText: string;
}

interface PackageMeta { label: string; accent: AccentTokens }

interface ServiceMeta {
  label: string;
  icon: string;
  accent: AccentTokens;
  packages?: Record<PackageType, PackageMeta>;
}

export const SERVICE_META: Record<ServiceType, ServiceMeta> = {
  website: {
    label: 'Website', icon: 'language',
    accent: { bg: 'bg-blue-50', iconText: 'text-blue-500', bar: 'bg-blue-500', badgeBg: 'bg-blue-50', badgeText: 'text-blue-700' },
    packages: {
      essentials: { label: 'Essentials', accent: { bg: 'bg-sky-50',     iconText: 'text-sky-500',    bar: 'bg-sky-400',    badgeBg: 'bg-sky-50',     badgeText: 'text-sky-700'     } },
      growth:     { label: 'Growth',     accent: { bg: 'bg-blue-100',   iconText: 'text-blue-600',   bar: 'bg-blue-500',   badgeBg: 'bg-blue-100',   badgeText: 'text-blue-800'    } },
      premium:    { label: 'Premium',    accent: { bg: 'bg-indigo-100', iconText: 'text-indigo-600', bar: 'bg-indigo-600', badgeBg: 'bg-indigo-100', badgeText: 'text-indigo-800'  } },
    },
  },
  software: {
    label: 'Software', icon: 'code',
    accent: { bg: 'bg-violet-50', iconText: 'text-violet-500', bar: 'bg-violet-500', badgeBg: 'bg-violet-50', badgeText: 'text-violet-700' },
    packages: {
      essentials: { label: 'Essentials', accent: { bg: 'bg-purple-50',   iconText: 'text-purple-500',  bar: 'bg-purple-400',  badgeBg: 'bg-purple-50',   badgeText: 'text-purple-700'  } },
      growth:     { label: 'Growth',     accent: { bg: 'bg-violet-100',  iconText: 'text-violet-600',  bar: 'bg-violet-500',  badgeBg: 'bg-violet-100',  badgeText: 'text-violet-800'  } },
      premium:    { label: 'Premium',    accent: { bg: 'bg-fuchsia-100', iconText: 'text-fuchsia-600', bar: 'bg-fuchsia-600', badgeBg: 'bg-fuchsia-100', badgeText: 'text-fuchsia-800' } },
    },
  },
  'mobile-app': {
    label: 'Mobile App', icon: 'smartphone',
    accent: { bg: 'bg-orange-50', iconText: 'text-orange-500', bar: 'bg-orange-500', badgeBg: 'bg-orange-50', badgeText: 'text-orange-700' },
  },
  branding: {
    label: 'Branding', icon: 'palette',
    accent: { bg: 'bg-pink-50', iconText: 'text-pink-500', bar: 'bg-pink-500', badgeBg: 'bg-pink-50', badgeText: 'text-pink-700' },
  },
  'logo-design': {
    label: 'Logo Design', icon: 'star',
    accent: { bg: 'bg-amber-50', iconText: 'text-amber-500', bar: 'bg-amber-500', badgeBg: 'bg-amber-50', badgeText: 'text-amber-700' },
  },
};

export const getProjectAccent = (
  service: ServiceType,
  pkg?: PackageType,
): AccentTokens & { label: string; icon: string } => {
  const meta    = SERVICE_META[service];
  const pkgMeta = pkg && meta.packages ? meta.packages[pkg] : null;
  const accent  = pkgMeta?.accent ?? meta.accent;
  const label   = pkgMeta ? `${meta.label} · ${pkgMeta.label}` : meta.label;
  return { ...accent, label, icon: meta.icon };
};

// ─── Phase ────────────────────────────────────────────────────────────────────

export type PhaseStatus = 'pending' | 'active' | 'done';

export interface Phase {
  id: string;
  title: string;
  icon: string;
  status: PhaseStatus;
  /** Admin flags this phase for the client to action */
  requiresClientAction: boolean;
  /** Client has confirmed this phase is done */
  clientCompleted: boolean;
  targetDate?: string;
  description?: string;
}

// ─── Default phase definitions ────────────────────────────────────────────────

export const DEFAULT_PHASE_DEFS: { title: string; icon: string }[] = [
  { title: 'Quotation',   icon: 'request_quote'   },
  { title: 'Brief',       icon: 'description'     },
  { title: 'Onboarding',  icon: 'person_add'      },
  { title: 'Contract',    icon: 'draw'            },
  { title: 'Invoice',     icon: 'receipt'         },
  { title: 'Design',      icon: 'design_services' },
  { title: 'Development', icon: 'code'            },
  { title: 'QA',          icon: 'bug_report'      },
  { title: 'Launch',      icon: 'rocket_launch'   },
];

/**
 * Build a Phase[] from DEFAULT_PHASE_DEFS.
 * activeIndex: index of the active phase (0-based); >= length means all done.
 */
export function buildDefaultPhases(activeIndex = 0): Phase[] {
  return DEFAULT_PHASE_DEFS.map((def, i) => ({
    id:                   `ph_${i}`,
    title:                def.title,
    icon:                 def.icon,
    status:               (i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'pending') as PhaseStatus,
    requiresClientAction: false,
    clientCompleted:      false,
  }));
}

/** Derive 0-based active phase index, or phases.length if all done. */
export function getActivePhaseIndex(phases: Phase[]): number {
  const idx = phases.findIndex(p => p.status === 'active');
  return idx === -1 ? phases.length : idx;
}

/** Progress as a 0-100 integer. */
export function getPhaseProgress(phases: Phase[]): number {
  if (!phases.length) return 0;
  return Math.round((phases.filter(p => p.status === 'done').length / phases.length) * 100);
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface ClientProject {
  id: string;
  clientId: string;
  name: string;
  status: 'active' | 'completed' | 'paused';
  phases: Phase[];
  agreedPayment: number;
  paidPayment: number;
  timeline: string;
  startedAt: number;
  service: ServiceType;
  package?: PackageType;
  assignedMemberIds?: string[];
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const daysAgo = (n: number) => Date.now() - n * 86400000;

export const DEMO_PROJECTS: ClientProject[] = [
  { id: 'p1',  clientId: 'c1', name: 'Brand Refresh',         service: 'branding',    status: 'active',    phases: buildDefaultPhases(4), agreedPayment: 8000,  paidPayment: 5000,  timeline: 'Q3 2026', startedAt: daysAgo(45),  assignedMemberIds: ['m1', 'm7'] },
  { id: 'p2',  clientId: 'c1', name: 'Social Media Kit',      service: 'logo-design', status: 'active',    phases: buildDefaultPhases(1), agreedPayment: 3500,  paidPayment: 1750,  timeline: 'Q4 2026', startedAt: daysAgo(10),  assignedMemberIds: ['m6'] },
  { id: 'p3',  clientId: 'c2', name: 'E-Commerce Redesign',   service: 'website',     package: 'premium',  status: 'active',    phases: buildDefaultPhases(6), agreedPayment: 12000, paidPayment: 9500,  timeline: 'Q3 2026', startedAt: daysAgo(60),  assignedMemberIds: ['m2', 'm4'] },
  { id: 'p4',  clientId: 'c3', name: 'Mobile App MVP',        service: 'mobile-app',  status: 'completed', phases: buildDefaultPhases(9), agreedPayment: 15000, paidPayment: 15000, timeline: 'Q2 2026', startedAt: daysAgo(120), assignedMemberIds: ['m3', 'm8'] },
  { id: 'p5',  clientId: 'c4', name: 'Marketing Site',        service: 'website',     package: 'growth',   status: 'paused',    phases: buildDefaultPhases(3), agreedPayment: 4500,  paidPayment: 2000,  timeline: 'TBD',     startedAt: daysAgo(90),  assignedMemberIds: ['m8'] },
  { id: 'p6',  clientId: 'c5', name: 'Dashboard Analytics',   service: 'software',    package: 'premium',  status: 'active',    phases: buildDefaultPhases(2), agreedPayment: 6000,  paidPayment: 2000,  timeline: 'Q4 2026', startedAt: daysAgo(20),  assignedMemberIds: ['m5', 'm2'] },
  { id: 'p7',  clientId: 'c6', name: 'Platform Redesign',     service: 'software',    package: 'growth',   status: 'paused',    phases: buildDefaultPhases(1), agreedPayment: 9000,  paidPayment: 3000,  timeline: 'TBD',     startedAt: daysAgo(50),  assignedMemberIds: ['m4'] },
  { id: 'p8',  clientId: 'c2', name: 'iOS Companion App',     service: 'mobile-app',  status: 'active',    phases: buildDefaultPhases(3), agreedPayment: 11000, paidPayment: 4500,  timeline: 'Q1 2027', startedAt: daysAgo(30),  assignedMemberIds: ['m3', 'm5'] },
  { id: 'p9',  clientId: 'c3', name: 'Brand Identity System', service: 'branding',    status: 'completed', phases: buildDefaultPhases(9), agreedPayment: 7500,  paidPayment: 7500,  timeline: 'Q1 2026', startedAt: daysAgo(180), assignedMemberIds: ['m1'] },
  { id: 'p10', clientId: 'c4', name: 'SaaS Operations Tool',  service: 'software',    package: 'essentials', status: 'active',  phases: buildDefaultPhases(5), agreedPayment: 5500,  paidPayment: 3000,  timeline: 'Q4 2026', startedAt: daysAgo(35),  assignedMemberIds: ['m2', 'm8'] },
  { id: 'p11', clientId: 'c5', name: 'Corporate Site',        service: 'website',     package: 'essentials', status: 'paused',  phases: buildDefaultPhases(2), agreedPayment: 3200,  paidPayment: 1000,  timeline: 'TBD',     startedAt: daysAgo(75),  assignedMemberIds: ['m7'] },
  { id: 'p12', clientId: 'c6', name: 'Logo & Brand Kit',      service: 'logo-design', status: 'active',    phases: buildDefaultPhases(2), agreedPayment: 2800,  paidPayment: 1400,  timeline: 'Q3 2026', startedAt: daysAgo(15),  assignedMemberIds: ['m6', 'm1'] },
];
