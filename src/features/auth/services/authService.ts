import type { AuthProfile, AuthProfileUpdateInput } from '@/src/types/auth';
import { DEV_SUPERADMIN_PROFILE } from '../authMode';

const localAuthUser = {
  uid: DEV_SUPERADMIN_PROFILE.uid,
  email: DEV_SUPERADMIN_PROFILE.email,
  displayName: DEV_SUPERADMIN_PROFILE.fullName,
};

export const authService = {
  async signIn() {
    return { user: localAuthUser };
  },

  async signInOrCreateAllowedUser() {
    return { user: localAuthUser };
  },

  async signOut() {
    return undefined;
  },

  async setPresence() {
    return undefined;
  },

  onAuthStateChanged(callback: (user: typeof localAuthUser | null) => void) {
    callback(localAuthUser);
    return () => undefined;
  },

  async loadProfile(): Promise<AuthProfile> {
    return DEV_SUPERADMIN_PROFILE;
  },

  async sendPasswordReset() {
    return undefined;
  },

  async verifyPasswordReset() {
    return '';
  },

  async confirmPasswordReset() {
    return undefined;
  },

  async completeRequiredPasswordChange(): Promise<AuthProfile> {
    return DEV_SUPERADMIN_PROFILE;
  },

  async updateCurrentProfile(input: AuthProfileUpdateInput): Promise<AuthProfile> {
    return { ...DEV_SUPERADMIN_PROFILE, ...input };
  },
};
