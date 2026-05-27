import { create } from "zustand";
import { buildDefaultPhases, getActivePhaseIndex } from "../types";
import type {
  ClientProject,
  ServiceType,
  PackageType,
  Phase,
  PhaseStatus,
} from "../types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { requireFirebase } from "@/src/firebase/requireFirebase";
import { projectDocToClientProject } from "@/src/firebase/firestoreTransformers";
import { useAuthStore } from "@/src/features/auth";
import type { AuthRole } from "@/src/types/auth";
import { FEEDBACK_MESSAGES } from "@/src/app/messages";

export type { ClientProject };

export const PROJECT_CREATE_ROLES: AuthRole[] = [
  "superadmin",
  "admin",
  "client",
];

export const canCreateProject = (role?: AuthRole | null): role is AuthRole =>
  Boolean(role && PROJECT_CREATE_ROLES.includes(role));

const projectStatusToFirestore = (status: ClientProject["status"]) =>
  status === "paused"
    ? "planning"
    : status === "completed"
      ? "completed"
      : "in-progress";

const activePhaseName = (project: Pick<ClientProject, "phases">) =>
  project.phases.find((phase) => phase.status === "active")?.title ??
  project.phases[0]?.title ??
  "Discovery/Brief";

const phaseToFirestore = (phase: Phase) => ({
  id: phase.id,
  title: phase.title,
  icon: phase.icon,
  status: phase.status,
  requiresClientAction: phase.requiresClientAction,
  clientCompleted: phase.clientCompleted,
  ...(phase.targetDate ? { targetDate: phase.targetDate } : {}),
  ...(phase.description ? { description: phase.description } : {}),
  ...(phase.phaseAmount != null ? { phaseAmount: phase.phaseAmount } : {}),
});

const projectToCreateDoc = (project: ClientProject, role: AuthRole) => ({
  clientId: project.clientId,
  name: project.name,
  title: project.name,
  phase: activePhaseName(project),
  status: projectStatusToFirestore(project.status),
  service: project.service,
  ...(project.package ? { package: project.package } : {}),
  timeline: project.timeline,
  agreedPayment: project.agreedPayment,
  paidPayment: project.paidPayment,
  remainingPayment: Math.max(project.agreedPayment - project.paidPayment, 0),
  assignedTeamIds: project.assignedMemberIds ?? [],
  phases: project.phases.map(phaseToFirestore),
  createdById: useAuthStore.getState().profile?.uid ?? "",
  createdByRole: role,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

const projectUpdatesToDoc = (updates: Partial<Omit<ClientProject, "id">>) => ({
  ...(updates.name !== undefined
    ? { name: updates.name, title: updates.name }
    : {}),
  ...(updates.status !== undefined
    ? { status: projectStatusToFirestore(updates.status) }
    : {}),
  ...(updates.service !== undefined ? { service: updates.service } : {}),
  ...(updates.package !== undefined ? { package: updates.package } : {}),
  ...(updates.timeline !== undefined ? { timeline: updates.timeline } : {}),
  ...(updates.agreedPayment !== undefined
    ? { agreedPayment: updates.agreedPayment }
    : {}),
  ...(updates.paidPayment !== undefined
    ? { paidPayment: updates.paidPayment }
    : {}),
  ...(updates.agreedPayment !== undefined || updates.paidPayment !== undefined
    ? {
        remainingPayment: Math.max(
          (updates.agreedPayment ?? 0) - (updates.paidPayment ?? 0),
          0,
        ),
      }
    : {}),
  ...(updates.clientId !== undefined ? { clientId: updates.clientId } : {}),
  ...(updates.assignedMemberIds !== undefined
    ? { assignedTeamIds: updates.assignedMemberIds }
    : {}),
  ...(updates.phases !== undefined
    ? {
        phases: updates.phases.map(phaseToFirestore),
        phase: activePhaseName({ phases: updates.phases }),
      }
    : {}),
  updatedAt: serverTimestamp(),
});

const persistProjectPhases = async (projectId: string, phases: Phase[]) => {
  await updateDoc(
    doc(requireFirebase().db, "projects", projectId),
    projectUpdatesToDoc({ phases }),
  );
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
  }) => Unsubscribe;
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
  /** Move a phase one step up or down in the ordered list */
  movePhase: (projectId: string, phaseId: string, dir: "up" | "down") => void;
  /** Make the given phase active; all phases before it become done, all after become pending */
  setActivePhase: (projectId: string, phaseId: string) => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  loading: { projects: false },
  ready: false,
  error: { projects: null },

  setProjects: (projects) => set({ projects, ready: true }),

  subscribeToProjects: (filter) => {
    set({ loading: { projects: true }, error: { projects: null } });
    const db = requireFirebase().db;
    const projectsRef = filter?.clientId
      ? query(
          collection(db, "projects"),
          where("clientId", "==", filter.clientId),
        )
      : filter?.teamId
        ? query(
            collection(db, "projects"),
            where("assignedTeamIds", "array-contains", filter.teamId),
          )
        : collection(db, "projects");

    return onSnapshot(
      projectsRef,
      (snapshot) => {
        set({
          projects: snapshot.docs.map((item) =>
            projectDocToClientProject(item),
          ),
          loading: { projects: false },
          ready: true,
          error: { projects: null },
        });
      },
      (error) =>
        set({
          loading: { projects: false },
          ready: true,
          error: { projects: error.message },
        }),
    );
  },

  addProject: async (project) => {
    const role = useAuthStore.getState().profile?.role;
    if (!canCreateProject(role)) {
      throw new Error(FEEDBACK_MESSAGES.sidebar.projectCreateNotAllowed);
    }
    await addDoc(
      collection(requireFirebase().db, "projects"),
      projectToCreateDoc(project, role),
    );
  },

  updateProject: async (id, updates) => {
    await updateDoc(
      doc(requireFirebase().db, "projects", id),
      projectUpdatesToDoc(updates),
    );
  },

  removeProject: async (id) => {
    await deleteDoc(doc(requireFirebase().db, "projects", id));
  },

  updatePhase: (projectId, phaseId, updates) => {
    const project = get().projects.find((item) => item.id === projectId);
    if (!project) return;
    const phases = project.phases.map((phase) =>
      phase.id === phaseId ? { ...phase, ...updates } : phase,
    );
    set((state) => ({
      projects: state.projects.map((item) =>
        item.id === projectId ? { ...item, phases } : item,
      ),
    }));
    void persistProjectPhases(projectId, phases).catch((error) =>
      set({ error: { projects: error.message } }),
    );
  },

  insertPhase: (projectId, afterIndex, phase) => {
    const project = get().projects.find((item) => item.id === projectId);
    if (!project) return;
    const phases = [...project.phases];
    phases.splice(afterIndex + 1, 0, phase);
    set((state) => ({
      projects: state.projects.map((item) =>
        item.id === projectId ? { ...item, phases } : item,
      ),
    }));
    void persistProjectPhases(projectId, phases).catch((error) =>
      set({ error: { projects: error.message } }),
    );
  },

  removePhase: (projectId, phaseId) => {
    const project = get().projects.find((item) => item.id === projectId);
    if (!project) return;
    const phases = project.phases.filter((phase) => phase.id !== phaseId);
    set((state) => ({
      projects: state.projects.map((item) =>
        item.id === projectId ? { ...item, phases } : item,
      ),
    }));
    void persistProjectPhases(projectId, phases).catch((error) =>
      set({ error: { projects: error.message } }),
    );
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
    if (nextIdx !== -1)
      phases[nextIdx] = { ...phases[nextIdx], status: "active" };
    set((state) => ({
      projects: state.projects.map((item) =>
        item.id === projectId ? { ...item, phases } : item,
      ),
    }));
    void persistProjectPhases(projectId, phases).catch((error) =>
      set({ error: { projects: error.message } }),
    );
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
    void persistProjectPhases(projectId, phases).catch((error) =>
      set({ error: { projects: error.message } }),
    );
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
    void persistProjectPhases(projectId, phases).catch((error) =>
      set({ error: { projects: error.message } }),
    );
  },
}));

export const makeNewProject = (overrides: {
  name: string;
  service: ServiceType;
  package?: PackageType;
  status: "active" | "paused" | "completed";
  timeline: string;
  clientId: string;
  assignedMemberIds?: string[];
  activePhaseIndex?: number;
}): ClientProject => {
  const { activePhaseIndex = 0, ...rest } = overrides;
  return {
    id: `p_${Date.now()}`,
    phases: buildDefaultPhases(activePhaseIndex),
    agreedPayment: 0,
    paidPayment: 0,
    startedAt: Date.now(),
    ...rest,
  };
};

export const getPhaseIndex = (project: ClientProject): number =>
  getActivePhaseIndex(project.phases);
