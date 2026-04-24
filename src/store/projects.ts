import { create } from 'zustand';
import { DEMO_PROJECTS, buildStages } from '../data/projects';
import type { ClientProject, ServiceType, PackageType } from '../data/projects';

export type { ClientProject };

interface ProjectsState {
  projects: ClientProject[];
  addProject: (project: ClientProject) => void;
  updateProject: (id: string, updates: Partial<Omit<ClientProject, 'id'>>) => void;
  removeProject: (id: string) => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: DEMO_PROJECTS,

  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  removeProject: (id) =>
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
}));

/** Build a fresh project scaffold for the add-project form.
 *  `currentPhaseIndex` maps to `buildStages`:
 *  0 = discovery is current, 7 = launch is current, 8 = all stages complete.
 */
export const makeNewProject = (overrides: {
  name: string;
  service: ServiceType;
  package?: PackageType;
  status: 'active' | 'paused' | 'completed';
  timeline: string;
  clientId: string;
  assignedMemberIds?: string[];
  currentPhaseIndex?: number;
}): ClientProject => {
  const { currentPhaseIndex = 0, ...rest } = overrides;
  return {
    id:            `p_${Date.now()}`,
    stages:        buildStages(currentPhaseIndex),
    agreedPayment: 0,
    paidPayment:   0,
    startedAt:     Date.now(),
    ...rest,
  };
};

/** Derive the "current phase index" from an existing project's stages array.
 *  Returns the index of the 'current' stage, or ALL_STAGES.length (8) if all done.
 */
export const getPhaseIndex = (project: ClientProject): number => {
  const idx = project.stages.findIndex(s => s.status === 'current');
  return idx === -1 ? 8 : idx;
};
