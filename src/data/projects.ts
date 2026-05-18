export {
  DEFAULT_PHASE_DEFS,
  SERVICE_META,
  buildDefaultPhases,
  getActivePhaseIndex,
  getPhaseProgress,
  getProjectAccent,
  type AccentTokens,
  type ClientProject,
  type PackageType,
  type Phase,
  type PhaseStatus,
  type ServiceType,
} from '@/src/features/projects/types';

// Demo data lives in seed.ts — re-exported here for Storybook compatibility.
export { DEMO_PROJECTS } from './seed';

