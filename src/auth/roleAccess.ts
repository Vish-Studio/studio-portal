import type { AuthRole } from '@/src/types/auth';

export const USER_ROLE: AuthRole = 'user';
export const SUPERADMIN_ROLE: AuthRole = 'superadmin';

export const STAFF_ROLES: AuthRole[] = [
  SUPERADMIN_ROLE,
];

export const ADMIN_AREA_ROLES: AuthRole[] = [
  SUPERADMIN_ROLE,
];

export const ROLE_LABELS: Record<AuthRole, string> = {
  user: 'User',
  superadmin: 'Superadmin',
};

export const isStaffRole = (role?: AuthRole | null) =>
  Boolean(role && STAFF_ROLES.includes(role));

export const canAccessRole = (
  userRole: AuthRole | null | undefined,
  allowedRoles: AuthRole[],
) => Boolean(userRole && allowedRoles.includes(userRole));

export const defaultRouteForRole = (role?: AuthRole | null) =>
  role === SUPERADMIN_ROLE ? '/admin' : '/user';
