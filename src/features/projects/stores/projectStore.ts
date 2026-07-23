import { create } from "zustand";
import { buildDefaultPhases, getActivePhaseIndex } from "../types";
import type { ClientProject, PackageType, Phase, PhaseStatus, ServiceType } from "../types";
import { useAuthStore } from "@/src/features/auth";
import type { AuthRole } from "@/src/types/auth";
import { FEEDBACK_MESSAGES } from "@/src/app/messages";

export type { ClientProject };

export const PROJECT_CREATE_ROLES: AuthRole[] = [
  "superadmin",
  "admin",
  "user",
];

export const canCreateProject = (role?: AuthRole | null): role is AuthRole =>
  Boolean(role && PROJECT_CREATE_ROLES.includes(role));

export const getPhaseIndex = getActivePhaseIndex;

export interface ProjectInput {
  name: string;
  service: ServiceType;
  package?: PackageType;
  pricingPackageId?: string;
  status: ClientProject['status'];
  timeline: string;
  startDate?: string;
  endDate?: string;
  agreedPayment: number;
  paidPayment?: number;
  clientId: string;
  assignedMemberIds?: string[];
}

export const makeNewProject = (input: ProjectInput): ClientProject => {
  const startDate = input.startDate || new Date().toISOString().slice(0, 10);
  return {
    id: `project_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    clientId: input.clientId,
    name: input.name,
    status: input.status,
    phases: buildDefaultPhases(0),
    agreedPayment: input.agreedPayment,
    paidPayment: input.paidPayment ?? 0,
    timeline: input.timeline,
    startedAt: new Date(startDate).getTime(),
    startDate,
    endDate: input.endDate,
    service: input.service,
    package: input.package,
    pricingPackageId: input.pricingPackageId,
    assignedMemberIds: input.assignedMemberIds ?? [],
  };
};

interface ProjectsState {
  projects: ClientProject[];
  loading: { projects: boolean };
  ready: boolean;
  error: { projects: string | null };
  setProjects: (projects: ClientProject[]) => void;
  subscribeToProjects: (filter?: {
    clientId?: string;
    teamId?: string;
  }) => () => void;
  addProject: (project: ClientProject) => Promise<void>;
  updateProject: (
    id: string,
    updates: Partial<Omit<ClientProject, "id">>,
  ) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  updatePhase: (
    projectId: string,
    phaseId: string,
    updates: Partial<Phase>,
  ) => void;
  insertPhase: (projectId: string, afterIndex: number, phase: Phase) => void;
  removePhase: (projectId: string, phaseId: string) => void;
  completePhase: (projectId: string, phaseId: string) => void;
  movePhase: (projectId: string, phaseId: string, dir: "up" | "down") => void;
  setActivePhase: (projectId: string, phaseId: string) => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  loading: { projects: false },
  ready: false,
  error: { projects: null },

  setProjects: (projects) => set({ projects, ready: true }),

  subscribeToProjects: () => {
    set({ loading: { projects: false }, ready: true, error: { projects: null } });
    return () => undefined;
  },

  addProject: async (project) => {
    const role = useAuthStore.getState().profile?.role;
    if (!canCreateProject(role)) {
      throw new Error(FEEDBACK_MESSAGES.sidebar.projectCreateNotAllowed);
    }
    set(state => ({ projects: [project, ...state.projects], ready: true }));
  },

  updateProject: async (id, updates) => {
    set(state => ({
      projects: state.projects.map(project => (
        project.id === id ? { ...project, ...updates } : project
      )),
    }));
  },

  removeProject: async (id) => {
    set(state => ({ projects: state.projects.filter(project => project.id !== id) }));
  },

  updatePhase: (projectId, phaseId, updates) => {
    set((state) => ({
      projects: state.projects.map((item) =>
        item.id === projectId
          ? {
              ...item,
              phases: item.phases.map((phase) =>
                phase.id === phaseId ? { ...phase, ...updates } : phase,
              ),
            }
          : item,
      ),
    }));
  },

  insertPhase: (projectId, afterIndex, phase) => {
    set((state) => ({
      projects: state.projects.map((item) => {
        if (item.id !== projectId) return item;
        const phases = [...item.phases];
        phases.splice(afterIndex + 1, 0, phase);
        return { ...item, phases };
      }),
    }));
  },

  removePhase: (projectId, phaseId) => {
    set((state) => ({
      projects: state.projects.map((item) =>
        item.id === projectId
          ? { ...item, phases: item.phases.filter((phase) => phase.id !== phaseId) }
          : item,
      ),
    }));
  },

  completePhase: (projectId, phaseId) => {
    const project = get().projects.find((item) => item.id === projectId);
    if (!project) return;
    const phases = project.phases.map((phase) =>
      phase.id === phaseId
        ? { ...phase, status: "done" as const, clientCompleted: true }
        : phase,
    );
    const nextIdx = phases.findIndex((phase) => phase.status === "pending");
    if (nextIdx !== -1) phases[nextIdx] = { ...phases[nextIdx], status: "active" };
    set((state) => ({
      projects: state.projects.map((item) =>
        item.id === projectId ? { ...item, phases } : item,
      ),
    }));
  },

  movePhase: (projectId, phaseId, dir) => {
    const project = get().projects.find((item) => item.id === projectId);
    if (!project) return;
    const phases = [...project.phases];
    const idx = phases.findIndex((phase) => phase.id === phaseId);
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= phases.length) return;
    [phases[idx], phases[swap]] = [phases[swap], phases[idx]];
    set((state) => ({
      projects: state.projects.map((item) =>
        item.id === projectId ? { ...item, phases } : item,
      ),
    }));
  },

  setActivePhase: (projectId, phaseId) => {
    const project = get().projects.find((item) => item.id === projectId);
    if (!project) return;
    const targetIdx = project.phases.findIndex((phase) => phase.id === phaseId);
    if (targetIdx === -1) return;
    const phases = project.phases.map((phase, index) => ({
      ...phase,
      status: (index < targetIdx
        ? "done"
        : index === targetIdx
          ? "active"
          : "pending") as PhaseStatus,
      clientCompleted: index < targetIdx ? phase.clientCompleted : false,
    }));
    set((state) => ({
      projects: state.projects.map((item) =>
        item.id === projectId ? { ...item, phases } : item,
      ),
    }));
  },
}));
