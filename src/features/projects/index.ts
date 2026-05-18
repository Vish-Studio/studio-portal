export { default as ProjectCard, ProjectCardMini, calcProgress } from './components/project-card/project-card';
export { default as ProjectHeroCard } from './components/project-hero-card/project-hero-card';
export { default as ProjectTimeline } from './components/project-timeline/project-timeline';
export { default as ProjectsOverview } from './components/projects-overview/projects-overview';
export { default as ProjectDetailPage } from './pages/ProjectDetailPage';
export { default as ProjectsPage } from './pages/ProjectsPage';
export {
  getPhaseIndex,
  makeNewProject,
  useProjectsStore,
} from './stores/projectStore';
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
} from './types';

