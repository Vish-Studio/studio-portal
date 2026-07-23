import type { AuthRole } from '@/src/types/auth';
import { SUPERADMIN_ROLE } from './roleAccess';

type ResourceAction = 'view' | 'create' | 'update' | 'delete' | 'manage';
type PermissionMatrix = Record<string, Partial<Record<ResourceAction, AuthRole[]>>>;

export const permissions = {
  clients: {
    view: [SUPERADMIN_ROLE],
    create: [SUPERADMIN_ROLE],
    update: [SUPERADMIN_ROLE],
    delete: [SUPERADMIN_ROLE],
  },
  projects: {
    view: [SUPERADMIN_ROLE],
    create: [SUPERADMIN_ROLE],
    update: [SUPERADMIN_ROLE],
    delete: [SUPERADMIN_ROLE],
  },
  tasks: {
    view: [SUPERADMIN_ROLE],
    create: [SUPERADMIN_ROLE],
    update: [SUPERADMIN_ROLE],
    delete: [SUPERADMIN_ROLE],
  },
  documents: {
    view: [SUPERADMIN_ROLE],
    create: [SUPERADMIN_ROLE],
    update: [SUPERADMIN_ROLE],
    delete: [SUPERADMIN_ROLE],
  },
  expenses: {
    view: [SUPERADMIN_ROLE],
    create: [SUPERADMIN_ROLE],
    update: [SUPERADMIN_ROLE],
    delete: [SUPERADMIN_ROLE],
  },
  settings: {
    view: [SUPERADMIN_ROLE],
    update: [SUPERADMIN_ROLE],
  },
} satisfies PermissionMatrix;

export const can = (
  role: AuthRole | null | undefined,
  resource: keyof typeof permissions,
  action: ResourceAction,
) => {
  const allowedRoles = permissions[resource][action] ?? [];
  return Boolean(role && allowedRoles.includes(role));
};
