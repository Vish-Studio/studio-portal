import { create } from 'zustand';
export type { TeamMember, TeamProject } from '../data/team';
import type { TeamMember, TeamProject } from '../data/team';
import { teamService, type TeamMemberInput } from '../services/firebase/team-service';

interface TeamState {
  members: TeamMember[];
  projects: TeamProject[];
  loading: boolean;
  ready: boolean;
  error: string | null;
  unsubscribe?: () => void;
  setMembers: (members: TeamMember[]) => void;
  setProjects: (projects: TeamProject[]) => void;
  subscribeMembers: () => () => void;
  addMember: (member: TeamMemberInput) => Promise<string | undefined>;
  updateMember: (id: string, updates: Partial<TeamMemberInput>) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  assignMember: (memberId: string, projectId: string | null) => Promise<void>;
}

export const useTeamStore = create<TeamState>((set) => ({
  members: [],  // hydrated on app start via initStores()
  projects: [], // hydrated on app start via initStores()
  loading: false,
  ready: false,
  error: null,
  unsubscribe: undefined,

  setMembers:  (members)  => set({ members }),
  setProjects: (projects) => set({ projects }),

  subscribeMembers: () => {
    const currentUnsubscribe = useTeamStore.getState().unsubscribe;
    if (currentUnsubscribe) return currentUnsubscribe;

    set({ members: [], loading: true, ready: false, error: null });

    const firestoreUnsubscribe = teamService.subscribeToMembers(
      members => set({
        members: [...members].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })),
        loading: false,
        ready: true,
        error: null,
      }),
      error => set({ members: [], loading: false, ready: true, error: error.message }),
    );

    const unsubscribe = () => {
      firestoreUnsubscribe();
      if (useTeamStore.getState().unsubscribe === unsubscribe) {
        set({ unsubscribe: undefined });
      }
    };

    set({ unsubscribe });
    return unsubscribe;
  },

  addMember: async (member) => {
    set({ loading: true, error: null });

    try {
      const id = await teamService.createMember(member);
      set({ loading: false });
      return id;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to add team member.';
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  updateMember: async (id, updates) => {
    set({ loading: true, error: null });

    try {
      await teamService.updateMember(id, updates);
      set({ loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update team member.';
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  removeMember: async (id) => {
    set({ loading: true, error: null });

    try {
      await teamService.deleteMember(id);
      set({ loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete team member.';
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  assignMember: async (memberId, projectId) => {
    set({ loading: true, error: null });

    try {
      await teamService.updateMember(memberId, { assignedProjectId: projectId });
      set({ loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to assign project.';
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
}));
