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

/** Build a fresh project scaffold for the add-project form. */
export const makeNewProject = (
  overrides: {
    name: string;
    service: ServiceType;
    package?: PackageType;
    status: 'active' | 'paused' | 'completed';
    timeline: string;
    clientId: string;
    assignedMemberIds?: string[];
  },
): ClientProject => ({
  id: `p_${Date.now()}`,
  stages: buildStages(0),
  agreedPayment: 0,
  paidPayment: 0,
  startedAt: Date.now(),
  ...overrides,
});
