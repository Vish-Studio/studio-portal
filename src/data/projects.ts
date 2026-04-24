// ─── Service & Package types ───────────────────────────────────────────────────

export type ServiceType = 'website' | 'software' | 'mobile-app' | 'branding' | 'logo-design';
export type PackageType = 'essentials' | 'growth' | 'premium';

// ─── Accent token shape ────────────────────────────────────────────────────────

export interface AccentTokens {
  bg: string;       // icon container background
  iconText: string; // icon color
  bar: string;      // progress bar fill
  badgeBg: string;  // service badge background
  badgeText: string;// service badge text
}

interface PackageMeta { label: string; accent: AccentTokens }

interface ServiceMeta {
  label: string;
  icon: string; // Material icon name
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

/** Resolve the active accent tokens + display label for a project's service + optional package. */
export const getProjectAccent = (
  service: ServiceType,
  pkg?: PackageType,
): AccentTokens & { label: string; icon: string } => {
  const meta = SERVICE_META[service];
  const pkgMeta = pkg && meta.packages ? meta.packages[pkg] : null;
  const accent = pkgMeta?.accent ?? meta.accent;
  const label  = pkgMeta ? `${meta.label} · ${pkgMeta.label}` : meta.label;
  return { ...accent, label, icon: meta.icon };
};

// ─── Stage types ───────────────────────────────────────────────────────────────

export type StageKey =
  | 'discovery'
  | 'onboarding'
  | 'contract'
  | 'invoice'
  | 'design'
  | 'development'
  | 'qa'
  | 'launch';

export type StageStatus = 'completed' | 'current' | 'upcoming';

export interface ProjectStage {
  key: StageKey;
  status: StageStatus;
}

export interface ClientProject {
  id: string;
  clientId: string;
  name: string;
  status: 'active' | 'completed' | 'paused';
  stages: ProjectStage[];
  agreedPayment: number;
  paidPayment: number;
  timeline: string;
  startedAt: number;
  service: ServiceType;
  package?: PackageType;
}

export const STAGE_META: Record<StageKey, { label: string; shortLabel: string; icon: string }> = {
  discovery:   { label: 'Discovery',   shortLabel: 'Disc.',   icon: 'search'           },
  onboarding:  { label: 'Onboarding',  shortLabel: 'Onboard', icon: 'person_add'       },
  contract:    { label: 'Contract',    shortLabel: 'Contract', icon: 'draw'            },
  invoice:     { label: 'Invoice',     shortLabel: 'Invoice',  icon: 'receipt'         },
  design:      { label: 'Design',      shortLabel: 'Design',   icon: 'design_services' },
  development: { label: 'Development', shortLabel: 'Dev',      icon: 'code'            },
  qa:          { label: 'QA Test',     shortLabel: 'QA',       icon: 'bug_report'      },
  launch:      { label: 'Launch',      shortLabel: 'Launch',   icon: 'rocket_launch'   },
};

export const ALL_STAGES: StageKey[] = [
  'discovery', 'onboarding', 'contract', 'invoice', 'design', 'development', 'qa', 'launch',
];

function buildStages(completedCount: number): ProjectStage[] {
  return ALL_STAGES.map((key, i) => ({
    key,
    status:
      i < completedCount  ? 'completed'
      : i === completedCount ? 'current'
      : 'upcoming',
  }));
}

const daysAgo = (n: number) => Date.now() - n * 86400000;

export const DEMO_PROJECTS: ClientProject[] = [
  { id: 'p1',  clientId: 'c1', name: 'Brand Refresh',         service: 'branding',    status: 'active',    stages: buildStages(4), agreedPayment: 8000,  paidPayment: 5000,  timeline: 'Q3 2026', startedAt: daysAgo(45)  },
  { id: 'p2',  clientId: 'c1', name: 'Social Media Kit',      service: 'logo-design', status: 'active',    stages: buildStages(1), agreedPayment: 3500,  paidPayment: 1750,  timeline: 'Q4 2026', startedAt: daysAgo(10)  },
  { id: 'p3',  clientId: 'c2', name: 'E-Commerce Redesign',   service: 'website',     package: 'premium',  status: 'active',    stages: buildStages(6), agreedPayment: 12000, paidPayment: 9500,  timeline: 'Q3 2026', startedAt: daysAgo(60)  },
  { id: 'p4',  clientId: 'c3', name: 'Mobile App MVP',        service: 'mobile-app',  status: 'completed', stages: buildStages(8), agreedPayment: 15000, paidPayment: 15000, timeline: 'Q2 2026', startedAt: daysAgo(120) },
  { id: 'p5',  clientId: 'c4', name: 'Marketing Site',        service: 'website',     package: 'growth',   status: 'paused',    stages: buildStages(3), agreedPayment: 4500,  paidPayment: 2000,  timeline: 'TBD',     startedAt: daysAgo(90)  },
  { id: 'p6',  clientId: 'c5', name: 'Dashboard Analytics',   service: 'software',    package: 'premium',  status: 'active',    stages: buildStages(2), agreedPayment: 6000,  paidPayment: 2000,  timeline: 'Q4 2026', startedAt: daysAgo(20)  },
  { id: 'p7',  clientId: 'c6', name: 'Platform Redesign',     service: 'software',    package: 'growth',   status: 'paused',    stages: buildStages(1), agreedPayment: 9000,  paidPayment: 3000,  timeline: 'TBD',     startedAt: daysAgo(50)  },
  { id: 'p8',  clientId: 'c2', name: 'iOS Companion App',     service: 'mobile-app',  status: 'active',    stages: buildStages(3), agreedPayment: 11000, paidPayment: 4500,  timeline: 'Q1 2027', startedAt: daysAgo(30)  },
  { id: 'p9',  clientId: 'c3', name: 'Brand Identity System', service: 'branding',    status: 'completed', stages: buildStages(8), agreedPayment: 7500,  paidPayment: 7500,  timeline: 'Q1 2026', startedAt: daysAgo(180) },
  { id: 'p10', clientId: 'c4', name: 'SaaS Operations Tool',  service: 'software',    package: 'essentials', status: 'active',  stages: buildStages(5), agreedPayment: 5500,  paidPayment: 3000,  timeline: 'Q4 2026', startedAt: daysAgo(35)  },
  { id: 'p11', clientId: 'c5', name: 'Corporate Site',        service: 'website',     package: 'essentials', status: 'paused',  stages: buildStages(2), agreedPayment: 3200,  paidPayment: 1000,  timeline: 'TBD',     startedAt: daysAgo(75)  },
  { id: 'p12', clientId: 'c6', name: 'Logo & Brand Kit',      service: 'logo-design', status: 'active',    stages: buildStages(2), agreedPayment: 2800,  paidPayment: 1400,  timeline: 'Q3 2026', startedAt: daysAgo(15)  },
];
