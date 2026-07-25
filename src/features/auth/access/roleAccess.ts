import type { AuthRole } from '../types';

export const USER_ROLE: AuthRole = 'user';
export const ADMIN_ROLE: AuthRole = 'admin';
export const SUPERADMIN_ROLE: AuthRole = 'superadmin';

export const STAFF_ROLES: AuthRole[] = [ADMIN_ROLE, SUPERADMIN_ROLE];
export const ADMIN_AREA_ROLES: AuthRole[] = [ADMIN_ROLE, SUPERADMIN_ROLE];

export const ROLE_LABELS: Record<AuthRole, string> = {
  admin: 'Admin',
  user: 'User',
  superadmin: 'Superadmin',
};

export const isStaffRole = (role?: AuthRole | null) => Boolean(role && STAFF_ROLES.includes(role));

export const canAccessRole = (
  userRole: AuthRole | null | undefined,
  allowedRoles: AuthRole[],
) => Boolean(userRole && allowedRoles.includes(userRole));

export const defaultRouteForRole = (role?: AuthRole | null) =>
  isStaffRole(role) ? '/admin' : '/user';
