import type { AuthProfile, AuthRole } from '@/src/types/auth';

export const AUTH_FLOW_ENABLED = false;

const now = Date.now();

export const DEV_SUPERADMIN_PROFILE: AuthProfile = {
  id: 'dev-superadmin',
  uid: 'dev-superadmin',
  email: 'vishseenarain@gmail.com',
  fullName: 'VISH Studio Superadmin',
  role: 'superadmin',
  staffRole: 'superadmin',
  needsPasswordChange: false,
  status: 'active',
  isActive: true,
  jobTitle: 'Studio owner',
  avatarColor: 'slate',
  createdAt: { toMillis: () => now } as AuthProfile['createdAt'],
};

export const DEV_USER_PROFILE: AuthProfile = {
  id: 'dev-user',
  uid: 'dev-user',
  email: 'client@vish.studio',
  fullName: 'Demo Client',
  role: 'user',
  needsPasswordChange: false,
  status: 'active',
  isActive: true,
  companyName: 'Demo Client Company',
  phoneNumber: '+230 0000 0000',
  avatarColor: 'amber',
  createdAt: { toMillis: () => now } as AuthProfile['createdAt'],
};

export const getDevProfileForRole = (role: AuthRole = 'superadmin') =>
  role === 'user' ? DEV_USER_PROFILE : DEV_SUPERADMIN_PROFILE;
