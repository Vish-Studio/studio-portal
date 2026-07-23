import type { AuthRole } from '@/src/types/auth';

export type ManagedUserKind = 'client' | 'team';
export type ManagedUserPasswordStatus = 'temporary' | 'changed';
export type ManagedUserAccountStatus = 'active' | 'inactive' | 'lost' | 'working' | 'on-leave' | 'fired';

export interface ManagedUser {
  id: string;
  sourceId: string;
  kind: ManagedUserKind;
  name: string;
  email: string;
  authRole: AuthRole;
  roleLabel: string;
  temporaryPassword: string;
  passwordStatus: ManagedUserPasswordStatus;
  accountStatus: ManagedUserAccountStatus;
  createdAt: number;
  updatedAt: number;
}

export interface ManagedUserInput {
  sourceId: string;
  kind: ManagedUserKind;
  name: string;
  email: string;
  authRole?: AuthRole;
  roleLabel: string;
  accountStatus: ManagedUserAccountStatus;
  temporaryPassword?: string;
}
