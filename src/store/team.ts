import { create } from "zustand";
import { DEMO_MEMBERS, DEMO_PROJECTS } from "../data/team";
export type { TeamMember, TeamProject } from "../data/team";

import type { TeamMember, TeamProject } from "../data/team";

interface TeamState {
  members: TeamMember[];
  projects: TeamProject[];
  setMembers: (members: TeamMember[]) => void;
  setProjects: (projects: TeamProject[]) => void;
  addMember: (member: TeamMember) => void;
  updateMember: (id: string, updates: Partial<Omit<TeamMember, 'id'>>) => void;
  removeMember: (id: string) => void;
  assignMember: (memberId: string, projectId: string | null) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  members: DEMO_MEMBERS,
  projects: DEMO_PROJECTS,

  setMembers: (members) => set({ members }),
  setProjects: (projects) => set({ projects }),

  addMember: (member) =>
    set((state) => ({ members: [...state.members, member] })),

  updateMember: (id, updates) =>
    set((state) => ({
      members: state.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),

  removeMember: (id) =>
    set((state) => ({ members: state.members.filter((m) => m.id !== id) })),

  assignMember: (memberId, projectId) =>
    set((state) => ({
      members: state.members.map((m) =>
        m.id === memberId ? { ...m, assignedProjectId: projectId } : m,
      ),
    })),
}));
