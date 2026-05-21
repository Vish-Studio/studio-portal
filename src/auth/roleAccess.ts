import type { AuthRole } from '@/src/types/auth';

export const CLIENT_ROLE: AuthRole = 'client';
export const FREELANCER_ROLE: AuthRole = 'freelancer';
export const TEAM_ROLE: AuthRole = 'team';
export const ADMIN_ROLE: AuthRole = 'admin';
export const SUPERADMIN_ROLE: AuthRole = 'superadmin';

export const STAFF_ROLES: AuthRole[] = [
  SUPERADMIN_ROLE,
  ADMIN_ROLE,
  FREELANCER_ROLE,
  TEAM_ROLE,
];

export const ADMIN_AREA_ROLES: AuthRole[] = [
  SUPERADMIN_ROLE,
  ADMIN_ROLE,
  FREELANCER_ROLE,
  TEAM_ROLE,
];

export const ROLE_LABELS: Record<AuthRole, string> = {
  client: 'Client',
  freelancer: 'Freelancer',
  team: 'Team',
  admin: 'Admin',
  superadmin: 'Superadmin',
};

export const isStaffRole = (role?: AuthRole | null) =>
  Boolean(role && STAFF_ROLES.includes(role));

export const canAccessRole = (
  userRole: AuthRole | null | undefined,
  allowedRoles: AuthRole[],
) => Boolean(userRole && allowedRoles.includes(userRole));

export const defaultRouteForRole = (role?: AuthRole | null) =>
  role === CLIENT_ROLE ? '/user' : '/admin';
