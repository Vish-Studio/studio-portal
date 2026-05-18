import type { AuthRole } from '@/src/types/auth';
import { ADMIN_ROLE, FREELANCER_ROLE, SUPERADMIN_ROLE } from './roleAccess';

type ResourceAction = 'view' | 'create' | 'update' | 'delete' | 'manage';
type PermissionMatrix = Record<string, Partial<Record<ResourceAction, AuthRole[]>>>;

export const permissions = {
  clients: {
    view: [ADMIN_ROLE, SUPERADMIN_ROLE],
    create: [ADMIN_ROLE, SUPERADMIN_ROLE],
    update: [ADMIN_ROLE, SUPERADMIN_ROLE],
    delete: [SUPERADMIN_ROLE],
  },
  projects: {
    view: [FREELANCER_ROLE, ADMIN_ROLE, SUPERADMIN_ROLE],
    create: [ADMIN_ROLE, SUPERADMIN_ROLE],
    update: [ADMIN_ROLE, SUPERADMIN_ROLE],
    delete: [SUPERADMIN_ROLE],
  },
  tasks: {
    view: [FREELANCER_ROLE, ADMIN_ROLE, SUPERADMIN_ROLE],
    create: [ADMIN_ROLE, SUPERADMIN_ROLE],
    update: [FREELANCER_ROLE, ADMIN_ROLE, SUPERADMIN_ROLE],
    delete: [ADMIN_ROLE, SUPERADMIN_ROLE],
  },
  documents: {
    view: [ADMIN_ROLE, SUPERADMIN_ROLE],
    create: [ADMIN_ROLE, SUPERADMIN_ROLE],
    update: [ADMIN_ROLE, SUPERADMIN_ROLE],
    delete: [SUPERADMIN_ROLE],
  },
  expenses: {
    view: [SUPERADMIN_ROLE],
    create: [SUPERADMIN_ROLE],
    update: [SUPERADMIN_ROLE],
    delete: [SUPERADMIN_ROLE],
  },
  settings: {
    view: [ADMIN_ROLE, SUPERADMIN_ROLE],
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

