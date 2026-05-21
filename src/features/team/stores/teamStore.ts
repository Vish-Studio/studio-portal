import { create } from 'zustand';
export type { TeamMember, TeamProject } from '../types';
import type { TeamMember, TeamProject } from '../types';
import { teamService } from '../services/teamService';

export interface TeamMemberInput {
  name:               string;
  role:               string;
  accessRole:         import('../types').TeamAccessRole;
  email:              string;
  assignedProjectId?: string | null;
  temporaryPassword?: string;
}

export interface TeamMemberCreateResult {
  id:                string;
  email:             string;
  temporaryPassword: string;
}

interface TeamState {
  members:          TeamMember[];
  projects:         TeamProject[];
  loading:          boolean;
  ready:            boolean;
  error:            string | null;
  setMembers:       (members: TeamMember[]) => void;
  setProjects:      (projects: TeamProject[]) => void;
  subscribeMembers: () => () => void;
  addMember:        (input: TeamMemberInput) => Promise<TeamMemberCreateResult | undefined>;
  updateMember:     (id: string, updates: Partial<TeamMemberInput>) => Promise<void>;
  removeMember:     (id: string) => Promise<void>;
  assignMember:     (memberId: string, projectId: string | null) => Promise<void>;
}

export const useTeamStore = create<TeamState>((set) => ({
  members:  [],
  projects: [],
  loading:  false,
  ready:    false,
  error:    null,

  setMembers:  (members)  => set({ members,  ready: true }),
  setProjects: (projects) => set({ projects }),

  subscribeMembers: () => {
    set({ loading: true, error: null });
    return teamService.subscribeToMembers(
      members => set({ members, loading: false, ready: true, error: null }),
      error => set({ members: [], loading: false, ready: true, error: error.message }),
    );
  },

  addMember: async (input) => {
    return teamService.createMember(input);
  },

  updateMember: async (id, updates) => {
    await teamService.updateMember(id, updates);
  },

  removeMember: async (id) => {
    await teamService.deleteMember(id);
  },

  assignMember: async (memberId, projectId) => {
    await teamService.assignMember(memberId, projectId);
    set(s => ({
      members: s.members.map(m =>
        m.id !== memberId ? m : { ...m, assignedProjectId: projectId },
      ),
    }));
  },
}));
