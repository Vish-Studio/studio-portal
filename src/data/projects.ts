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
}

export const STAGE_META: Record<StageKey, { label: string; shortLabel: string; icon: string }> = {
  discovery:   { label: 'Discovery',    shortLabel: 'Disc.',  icon: 'search'          },
  onboarding:  { label: 'Onboarding',   shortLabel: 'Onboard',icon: 'person_add'      },
  contract:    { label: 'Contract',     shortLabel: 'Contract',icon: 'draw'           },
  invoice:     { label: 'Invoice',      shortLabel: 'Invoice', icon: 'receipt'        },
  design:      { label: 'Design',       shortLabel: 'Design',  icon: 'design_services'},
  development: { label: 'Development',  shortLabel: 'Dev',     icon: 'code'           },
  qa:          { label: 'QA Test',      shortLabel: 'QA',      icon: 'bug_report'     },
  launch:      { label: 'Launch',       shortLabel: 'Launch',  icon: 'rocket_launch'  },
};

export const ALL_STAGES: StageKey[] = [
  'discovery', 'onboarding', 'contract', 'invoice', 'design', 'development', 'qa', 'launch',
];

/** Build a stages array where the first `completedCount` stages are done,
 *  the next is current (if < 8), and the rest are upcoming. */
function buildStages(completedCount: number): ProjectStage[] {
  return ALL_STAGES.map((key, i) => ({
    key,
    status:
      i < completedCount ? 'completed'
      : i === completedCount ? 'current'
      : 'upcoming',
  }));
}

const daysAgo = (n: number) => Date.now() - n * 86400000;

export const DEMO_PROJECTS: ClientProject[] = [
  // c1 — Sarah Mitchell / Acme Corp
  { id: 'p1', clientId: 'c1', name: 'Brand Refresh',       status: 'active',    stages: buildStages(4), agreedPayment: 8000,  paidPayment: 5000,  timeline: 'Q3 2026', startedAt: daysAgo(45) },
  { id: 'p2', clientId: 'c1', name: 'Social Media Kit',    status: 'active',    stages: buildStages(1), agreedPayment: 3500,  paidPayment: 1750,  timeline: 'Q4 2026', startedAt: daysAgo(10) },
  // c2 — James Lee / Globex
  { id: 'p3', clientId: 'c2', name: 'E-Commerce Redesign', status: 'active',    stages: buildStages(6), agreedPayment: 12000, paidPayment: 9500,  timeline: 'Q3 2026', startedAt: daysAgo(60) },
  // c3 — Priya Shah / Initech (completed)
  { id: 'p4', clientId: 'c3', name: 'Mobile App MVP',      status: 'completed', stages: buildStages(8), agreedPayment: 15000, paidPayment: 15000, timeline: 'Q2 2026', startedAt: daysAgo(120) },
  // c4 — Tony Nguyen / Stark Ind. (paused/lost)
  { id: 'p5', clientId: 'c4', name: 'Marketing Site',      status: 'paused',    stages: buildStages(3), agreedPayment: 4500,  paidPayment: 2000,  timeline: 'TBD',     startedAt: daysAgo(90) },
  // c5 — Elena Vasquez / Umbrella
  { id: 'p6', clientId: 'c5', name: 'Dashboard Analytics', status: 'active',    stages: buildStages(2), agreedPayment: 6000,  paidPayment: 2000,  timeline: 'Q4 2026', startedAt: daysAgo(20) },
  // c6 — Marcus Webb / Weyland Co
  { id: 'p7', clientId: 'c6', name: 'Platform Redesign',   status: 'paused',    stages: buildStages(1), agreedPayment: 9000,  paidPayment: 3000,  timeline: 'TBD',     startedAt: daysAgo(50) },
];
