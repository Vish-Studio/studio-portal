import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { generateTemporaryPassword } from '@/src/lib/temporary-password';
import type { ManagedUser, ManagedUserInput, ManagedUserKind, ManagedUserAccountStatus } from '../types';

interface UsersState {
  users: ManagedUser[];
  setUsers: (users: ManagedUser[]) => void;
  upsertUser: (input: ManagedUserInput) => ManagedUser;
  removeUserBySource: (kind: ManagedUserKind, sourceId: string) => void;
  resetPassword: (id: string) => string;
  markPasswordChangedByEmail: (email: string) => void;
  updateUserStatus: (id: string, accountStatus: ManagedUserAccountStatus) => void;
}

const userId = (kind: ManagedUserKind, sourceId: string) => `${kind}_${sourceId}`;

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: [],

      setUsers: (users) => set({ users }),

      upsertUser: (input) => {
        const now = Date.now();
        const id = userId(input.kind, input.sourceId);
        const existing = get().users.find(user => user.id === id);
        const temporaryPassword = input.temporaryPassword?.trim() || existing?.temporaryPassword || generateTemporaryPassword();
        const user: ManagedUser = {
          id,
          sourceId: input.sourceId,
          kind: input.kind,
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          authRole: input.authRole ?? existing?.authRole ?? 'user',
          roleLabel: input.roleLabel.trim(),
          accountStatus: input.accountStatus,
          temporaryPassword,
          passwordStatus: input.temporaryPassword ? 'temporary' : existing?.passwordStatus ?? 'temporary',
          createdAt: existing?.createdAt ?? now,
          updatedAt: now,
        };

        set(state => ({
          users: existing
            ? state.users.map(current => (current.id === id ? user : current))
            : [user, ...state.users],
        }));

        return user;
      },

      removeUserBySource: (kind, sourceId) => {
        const id = userId(kind, sourceId);
        set(state => ({ users: state.users.filter(user => user.id !== id) }));
      },

      resetPassword: (id) => {
        const temporaryPassword = generateTemporaryPassword();
        const now = Date.now();
        set(state => ({
          users: state.users.map(user => (
            user.id === id
              ? { ...user, temporaryPassword, passwordStatus: 'temporary', updatedAt: now }
              : user
          )),
        }));
        return temporaryPassword;
      },

      markPasswordChangedByEmail: (email) => {
        const now = Date.now();
        const normalizedEmail = email.trim().toLowerCase();
        set(state => ({
          users: state.users.map(user => (
            user.email === normalizedEmail ? { ...user, passwordStatus: 'changed', updatedAt: now } : user
          )),
        }));
      },

      updateUserStatus: (id, accountStatus) => {
        const now = Date.now();
        set(state => ({
          users: state.users.map(user => (
            user.id === id ? { ...user, accountStatus, updatedAt: now } : user
          )),
        }));
      },
    }),
    {
      name: 'studio-portal-managed-users',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
