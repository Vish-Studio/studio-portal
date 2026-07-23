import { create } from 'zustand';
export type { AuthProfile, AuthRole } from '@/src/types/auth';
import type { AuthProfile, AuthProfileUpdateInput } from '@/src/types/auth';
import { DEV_SUPERADMIN_PROFILE, getDevProfileForRole } from '../authMode';

interface LocalAuthUser {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthState {
  user: LocalAuthUser | null;
  profile: AuthProfile | null;
  loading: boolean;
  ready: boolean;
  error: string | null;
  role: AuthProfile['role'] | null;
  setAccessRole: (role: AuthProfile['role']) => void;
  signIn: (email: string, password: string) => Promise<AuthProfile>;
  sendPasswordReset: (email: string) => Promise<void>;
  verifyPasswordReset: (code: string) => Promise<string>;
  confirmPasswordReset: (code: string, password: string) => Promise<void>;
  completeRequiredPasswordChange: (password: string) => Promise<AuthProfile>;
  updateProfile: (updates: AuthProfileUpdateInput) => Promise<AuthProfile>;
  signOutUser: () => Promise<void>;
  initAuthListener: () => () => void;
}

const localUserFromProfile = (profile: AuthProfile): LocalAuthUser => ({
  uid: profile.uid,
  email: profile.email,
  displayName: profile.fullName,
});

export const useAuthStore = create<AuthState>((set) => ({
  user: localUserFromProfile(DEV_SUPERADMIN_PROFILE),
  profile: DEV_SUPERADMIN_PROFILE,
  loading: false,
  ready: true,
  error: null,
  role: DEV_SUPERADMIN_PROFILE.role,

  setAccessRole: (role) => {
    const profile = getDevProfileForRole(role);
    set({ user: localUserFromProfile(profile), profile, role: profile.role, loading: false, ready: true, error: null });
  },

  signIn: async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const profile = normalizedEmail.includes('admin') && !normalizedEmail.includes('super')
      ? getDevProfileForRole('admin')
      : normalizedEmail.includes('client') || normalizedEmail.includes('user')
        ? getDevProfileForRole('user')
        : DEV_SUPERADMIN_PROFILE;
    set({ user: localUserFromProfile(profile), profile, role: profile.role, loading: false, ready: true, error: null });
    return profile;
  },

  sendPasswordReset: async () => undefined,

  verifyPasswordReset: async () => '',

  confirmPasswordReset: async () => undefined,

  completeRequiredPasswordChange: async () => {
    const profile = DEV_SUPERADMIN_PROFILE;
    set({ user: localUserFromProfile(profile), profile, role: profile.role, loading: false, ready: true, error: null });
    return profile;
  },

  updateProfile: async (updates) => {
    let nextProfile: AuthProfile;
    set((state) => {
      const currentProfile = state.profile ?? DEV_SUPERADMIN_PROFILE;
      nextProfile = { ...currentProfile, ...updates, updatedAt: { toMillis: () => Date.now(), toDate: () => new Date() } };
      return {
        user: localUserFromProfile(nextProfile),
        profile: nextProfile,
        role: nextProfile.role,
        loading: false,
        ready: true,
        error: null,
      };
    });
    return nextProfile!;
  },

  signOutUser: async () => {
    set({ user: null, profile: null, role: null, error: null, ready: true, loading: false });
  },

  initAuthListener: () => {
    const profile = DEV_SUPERADMIN_PROFILE;
    set({ user: localUserFromProfile(profile), profile, role: profile.role, ready: true, loading: false, error: null });
    return () => undefined;
  },
}));
