import type { AuthRole } from '@/src/types/auth';
import { ADMIN_ROLE, SUPERADMIN_ROLE, USER_ROLE } from './roleAccess';

type ResourceAction = 'view' | 'create' | 'update' | 'delete' | 'manage';
type PermissionMatrix = Record<string, Partial<Record<ResourceAction, AuthRole[]>>>;
const LOCAL_CRUD_ROLES: AuthRole[] = [SUPERADMIN_ROLE, ADMIN_ROLE, USER_ROLE];

export const permissions = {
  clients: {
    view: LOCAL_CRUD_ROLES,
    create: LOCAL_CRUD_ROLES,
    update: LOCAL_CRUD_ROLES,
    delete: LOCAL_CRUD_ROLES,
  },
  projects: {
    view: LOCAL_CRUD_ROLES,
    create: LOCAL_CRUD_ROLES,
    update: LOCAL_CRUD_ROLES,
    delete: LOCAL_CRUD_ROLES,
  },
  tasks: {
    view: LOCAL_CRUD_ROLES,
    create: LOCAL_CRUD_ROLES,
    update: LOCAL_CRUD_ROLES,
    delete: LOCAL_CRUD_ROLES,
  },
  documents: {
    view: LOCAL_CRUD_ROLES,
    create: LOCAL_CRUD_ROLES,
    update: LOCAL_CRUD_ROLES,
    delete: LOCAL_CRUD_ROLES,
  },
  expenses: {
    view: LOCAL_CRUD_ROLES,
    create: LOCAL_CRUD_ROLES,
    update: LOCAL_CRUD_ROLES,
    delete: LOCAL_CRUD_ROLES,
  },
  settings: {
    view: LOCAL_CRUD_ROLES,
    update: LOCAL_CRUD_ROLES,
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
