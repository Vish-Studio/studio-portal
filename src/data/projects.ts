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
  { title: 'Discovery/Brief', icon: 'explore'         },
  { title: 'Proposal',        icon: 'description'     },
  { title: 'Quotation',       icon: 'request_quote'   },
  { title: 'Invoice',         icon: 'receipt'         },
  { title: 'Design',          icon: 'design_services' },
  { title: 'Revision',        icon: 'rate_review'     },
  { title: 'Development',     icon: 'code'            },
  { title: 'Review',          icon: 'fact_check'      },
  { title: 'Invoice',         icon: 'receipt_long'    },
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

// Demo data lives in seed.ts — re-exported here for Storybook compatibility
export { DEMO_PROJECTS } from './seed';
