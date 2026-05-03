import { create } from 'zustand';
import { buildDefaultPhases, getActivePhaseIndex } from '../data/projects';
import type { ClientProject, ServiceType, PackageType, Phase } from '../data/projects';

export type { ClientProject };

interface ProjectsState {
  projects: ClientProject[];
  setProjects:   (projects: ClientProject[]) => void;
  addProject:    (project: ClientProject) => void;
  updateProject: (id: string, updates: Partial<Omit<ClientProject, 'id'>>) => void;
  removeProject: (id: string) => void;
  updatePhase:   (projectId: string, phaseId: string, updates: Partial<Phase>) => void;
  insertPhase:   (projectId: string, afterIndex: number, phase: Phase) => void;
  removePhase:   (projectId: string, phaseId: string) => void;
  completePhase: (projectId: string, phaseId: string) => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [], // hydrated on app start via initStores()

  setProjects: (projects) => set({ projects }),

  addProject: (project) =>
    set((s) => ({ projects: [project, ...s.projects] })),

  updateProject: (id, updates) =>
    set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)) })),

  removeProject: (id) =>
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

  updatePhase: (projectId, phaseId, updates) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id !== projectId ? p : {
          ...p,
          phases: p.phases.map((ph) => ph.id === phaseId ? { ...ph, ...updates } : ph),
        },
      ),
    })),

  insertPhase: (projectId, afterIndex, phase) =>
    set((s) => ({
      projects: s.projects.map((p) => {
        if (p.id !== projectId) return p;
        const phases = [...p.phases];
        phases.splice(afterIndex + 1, 0, phase);
        return { ...p, phases };
      }),
    })),

  removePhase: (projectId, phaseId) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id !== projectId ? p : { ...p, phases: p.phases.filter((ph) => ph.id !== phaseId) },
      ),
    })),

  completePhase: (projectId, phaseId) =>
    set((s) => ({
      projects: s.projects.map((p) => {
        if (p.id !== projectId) return p;
        const phases = p.phases.map((ph) =>
          ph.id === phaseId ? { ...ph, status: 'done' as const, clientCompleted: true } : ph,
        );
        const nextIdx = phases.findIndex((ph) => ph.status === 'pending');
        if (nextIdx !== -1) phases[nextIdx] = { ...phases[nextIdx], status: 'active' };
        return { ...p, phases };
      }),
    })),
}));

export const makeNewProject = (overrides: {
  name: string;
  service: ServiceType;
  package?: PackageType;
  status: 'active' | 'paused' | 'completed';
  timeline: string;
  clientId: string;
  assignedMemberIds?: string[];
  activePhaseIndex?: number;
}): ClientProject => {
  const { activePhaseIndex = 0, ...rest } = overrides;
  return {
    id:            `p_${Date.now()}`,
    phases:        buildDefaultPhases(activePhaseIndex),
    agreedPayment: 0,
    paidPayment:   0,
    startedAt:     Date.now(),
    ...rest,
  };
};

export const getPhaseIndex = (project: ClientProject): number =>
  getActivePhaseIndex(project.phases);
