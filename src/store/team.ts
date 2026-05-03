import { create } from 'zustand';
export type { TeamMember, TeamProject } from '../data/team';
import type { TeamMember, TeamProject } from '../data/team';

interface TeamState {
  members: TeamMember[];
  projects: TeamProject[];
  setMembers:    (members: TeamMember[]) => void;
  setProjects:   (projects: TeamProject[]) => void;
  addMember:     (member: TeamMember) => void;
  updateMember:  (id: string, updates: Partial<Omit<TeamMember, 'id'>>) => void;
  removeMember:  (id: string) => void;
  assignMember:  (memberId: string, projectId: string | null) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  members: [],  // hydrated on app start via initStores()
  projects: [], // hydrated on app start via initStores()

  setMembers:  (members)  => set({ members }),
  setProjects: (projects) => set({ projects }),

  addMember: (member) =>
    set((s) => ({ members: [...s.members, member] })),

  updateMember: (id, updates) =>
    set((s) => ({
      members: s.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),

  removeMember: (id) =>
    set((s) => ({ members: s.members.filter((m) => m.id !== id) })),

  assignMember: (memberId, projectId) =>
    set((s) => ({
      members: s.members.map((m) =>
        m.id === memberId ? { ...m, assignedProjectId: projectId } : m,
      ),
    })),
}));
