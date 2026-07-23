import { create } from 'zustand';
export type { TeamMember, TeamProject } from '../types';
import type { TeamAccessRole, TeamMember, TeamProject, TeamSalaryType, TeamWorkStatus } from '../types';
import { randomAvatarTone } from '@/src/shared/components/avatar/avatar';

export interface TeamMemberInput {
  name: string;
  role: string;
  accessRole: TeamAccessRole;
  email: string;
  phone?: string;
  salaryAmount?: number;
  salaryType?: TeamSalaryType;
  status?: TeamWorkStatus;
  assignedProjectId?: string | null;
  temporaryPassword?: string;
}

export interface TeamMemberCreateResult {
  id: string;
  email: string;
  temporaryPassword: string;
}

interface TeamState {
  members: TeamMember[];
  projects: TeamProject[];
  loading: boolean;
  ready: boolean;
  error: string | null;
  setMembers: (members: TeamMember[]) => void;
  setProjects: (projects: TeamProject[]) => void;
  subscribeMembers: () => () => void;
  addMember: (input: TeamMemberInput) => Promise<TeamMemberCreateResult | undefined>;
  updateMember: (id: string, updates: Partial<TeamMemberInput>) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  assignMember: (memberId: string, projectId: string | null) => Promise<void>;
}

const localId = () => `member_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const timestamp = () => ({ toMillis: () => Date.now(), toDate: () => new Date() });

export const useTeamStore = create<TeamState>((set) => ({
  members: [],
  projects: [],
  loading: false,
  ready: false,
  error: null,

  setMembers: (members) => set({ members, ready: true }),
  setProjects: (projects) => set({ projects }),

  subscribeMembers: () => {
    set({ loading: false, ready: true, error: null });
    return () => undefined;
  },

  addMember: async (input) => {
    const id = localId();
    const email = input.email.trim().toLowerCase();
    const temporaryPassword = input.temporaryPassword?.trim() || 'local-password';
    const member: TeamMember = {
      id,
      userId: id,
      name: input.name.trim(),
      role: input.role.trim(),
      accessRole: input.accessRole,
      email,
      phone: input.phone?.trim() ?? '',
      salaryAmount: Number(input.salaryAmount ?? 0),
      salaryType: input.salaryType ?? 'monthly',
      assignedProjectId: input.assignedProjectId ?? null,
      status: input.status ?? 'working',
      isOnline: false,
      avatarColor: randomAvatarTone(),
      createdAt: timestamp(),
      updatedAt: timestamp(),
    };
    set(state => ({ members: [member, ...state.members], ready: true }));
    return { id, email, temporaryPassword };
  },

  updateMember: async (id, updates) => {
    set(state => ({
      members: state.members.map(member => (
        member.id === id
          ? {
              ...member,
              name: updates.name?.trim() ?? member.name,
              role: updates.role?.trim() ?? member.role,
              accessRole: updates.accessRole ?? member.accessRole,
              email: updates.email?.trim().toLowerCase() ?? member.email,
              phone: updates.phone?.trim() ?? member.phone,
              salaryAmount: updates.salaryAmount !== undefined ? Number(updates.salaryAmount) : member.salaryAmount,
              salaryType: updates.salaryType ?? member.salaryType,
              assignedProjectId: updates.assignedProjectId !== undefined ? updates.assignedProjectId : member.assignedProjectId,
              status: updates.status ?? member.status,
              updatedAt: timestamp(),
            }
          : member
      )),
    }));
  },

  removeMember: async (id) => {
    set(state => ({ members: state.members.filter(member => member.id !== id) }));
  },

  assignMember: async (memberId, projectId) => {
    set(state => ({
      members: state.members.map(member =>
        member.id !== memberId ? member : { ...member, assignedProjectId: projectId, updatedAt: timestamp() },
      ),
    }));
  },
}));
