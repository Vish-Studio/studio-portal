import { create } from 'zustand';
import type { User } from 'firebase/auth';
import { isFirebaseConfigured } from '@/src/firebase/config';
import { authService } from '../services/authService';
export type { AuthProfile, AuthRole } from '@/src/types/auth';
import type { AuthProfile, AuthProfileUpdateInput } from '@/src/types/auth';
import { runOperationWithFeedback } from '@/src/lib/operation-feedback';
import { FEEDBACK_MESSAGES } from '@/src/app/messages';
import { firebaseErrorMessage, logFirebaseError } from '@/src/lib/firebase-errors';
import { AUTH_FLOW_ENABLED, DEV_SUPERADMIN_PROFILE, getDevProfileForRole } from '../authMode';

interface AuthState {
  user: User | null;
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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: AUTH_FLOW_ENABLED ? null : DEV_SUPERADMIN_PROFILE,
  loading: false,
  ready: !AUTH_FLOW_ENABLED,
  error: null,
  role: AUTH_FLOW_ENABLED ? null : DEV_SUPERADMIN_PROFILE.role,

  setAccessRole: (role) => {
    if (AUTH_FLOW_ENABLED) return;
    const profile = getDevProfileForRole(role);
    set({ user: null, profile, role: profile.role, loading: false, ready: true, error: null });
  },

  signIn: async (email, password) => {
    if (!AUTH_FLOW_ENABLED) {
      const profile = DEV_SUPERADMIN_PROFILE;
      set({ user: null, profile, role: profile.role, loading: false, ready: true, error: null });
      return profile;
    }

    set({ loading: true, error: null });
    try {
      const credential = await authService.signIn(email, password);
      const profile = await authService.loadProfile(credential.user);
      set({ user: credential.user, profile, role: profile.role, loading: false, ready: true });
      return profile;
    } catch (error) {
      logFirebaseError('auth.signIn', error);
      const message = firebaseErrorMessage(error);
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  sendPasswordReset: async (email) => {
    if (!AUTH_FLOW_ENABLED) return;

    set({ loading: true, error: null });
    try {
      await authService.sendPasswordReset(email);
      set({ loading: false });
    } catch (error) {
      logFirebaseError('auth.sendPasswordReset', error);
      const message = firebaseErrorMessage(error);
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  verifyPasswordReset: async (code) => {
    if (!AUTH_FLOW_ENABLED) return '';

    try {
      return await authService.verifyPasswordReset(code);
    } catch (error) {
      logFirebaseError('auth.verifyPasswordReset', error);
      const message = firebaseErrorMessage(error);
      set({ error: message });
      throw new Error(message);
    }
  },

  confirmPasswordReset: async (code, password) => {
    if (!AUTH_FLOW_ENABLED) return;

    set({ loading: true, error: null });
    try {
      await authService.confirmPasswordReset(code, password);
      set({ loading: false });
    } catch (error) {
      logFirebaseError('auth.confirmPasswordReset', error);
      const message = firebaseErrorMessage(error);
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  completeRequiredPasswordChange: async (password) => {
    if (!AUTH_FLOW_ENABLED) {
      const profile = DEV_SUPERADMIN_PROFILE;
      set({ profile, role: profile.role, loading: false, ready: true, error: null });
      return profile;
    }

    set({ loading: true, error: null });
    try {
      const profile = await runOperationWithFeedback({
        loadingLabel: 'Updating password',
        successTitle: FEEDBACK_MESSAGES.auth.passwordUpdated,
        errorTitle: FEEDBACK_MESSAGES.auth.updatePasswordFailed,
        action: () => authService.completeRequiredPasswordChange(password),
      });
      set({ profile, role: profile.role, loading: false });
      return profile;
    } catch (error) {
      logFirebaseError('auth.completeRequiredPasswordChange', error);
      const message = firebaseErrorMessage(error);
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  updateProfile: async (updates) => {
    if (!AUTH_FLOW_ENABLED) {
      let nextProfile: AuthProfile;
      set((state) => {
        const currentProfile = state.profile ?? DEV_SUPERADMIN_PROFILE;
        nextProfile = { ...currentProfile, ...updates };
        return { profile: nextProfile, role: nextProfile.role, loading: false, ready: true, error: null };
      });
      return nextProfile!;
    }

    set({ loading: true, error: null });
    try {
      const profile = await runOperationWithFeedback({
        loadingLabel: 'Updating profile',
        successTitle: FEEDBACK_MESSAGES.auth.profileUpdated,
        errorTitle: FEEDBACK_MESSAGES.auth.updateProfileFailed,
        action: () => authService.updateCurrentProfile(updates),
      });
      set({ profile, role: profile.role, loading: false });
      return profile;
    } catch (error) {
      logFirebaseError('auth.updateProfile', error);
      const message = firebaseErrorMessage(error);
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  signOutUser: async () => {
    if (!AUTH_FLOW_ENABLED) {
      const profile = DEV_SUPERADMIN_PROFILE;
      set({ user: null, profile, role: profile.role, error: null, ready: true, loading: false });
      return;
    }

    await authService.signOut();
    set({ user: null, profile: null, role: null, error: null, ready: true });
  },

  initAuthListener: () => {
    if (!AUTH_FLOW_ENABLED) {
      const profile = DEV_SUPERADMIN_PROFILE;
      set({ user: null, profile, role: profile.role, ready: true, loading: false, error: null });
      return () => undefined;
    }

    if (!isFirebaseConfigured) {
      set({ ready: true, loading: false });
      return () => undefined;
    }

    set({ loading: true });
    let activeUid: string | null = null;
    let cleanupPresenceListeners: (() => void) | null = null;

    const clearPresence = () => {
      cleanupPresenceListeners?.();
      cleanupPresenceListeners = null;
      if (activeUid) {
        void authService.setPresence(activeUid, false).catch(error => {
          logFirebaseError('auth.presence.offline', error);
        });
      }
      activeUid = null;
    };

    const setupPresence = (uid: string) => {
      if (activeUid === uid) return;
      clearPresence();
      activeUid = uid;

      const markOnline = () => {
        void authService.setPresence(uid, true).catch(error => {
          logFirebaseError('auth.presence.online', error);
        });
      };
      const markOffline = () => {
        void authService.setPresence(uid, false).catch(error => {
          logFirebaseError('auth.presence.offline', error);
        });
      };
      const handleVisibility = () => {
        if (document.visibilityState === 'visible') markOnline();
        else markOffline();
      };

      markOnline();

      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        window.addEventListener('online', markOnline);
        window.addEventListener('offline', markOffline);
        window.addEventListener('beforeunload', markOffline);
        document.addEventListener('visibilitychange', handleVisibility);
        cleanupPresenceListeners = () => {
          window.removeEventListener('online', markOnline);
          window.removeEventListener('offline', markOffline);
          window.removeEventListener('beforeunload', markOffline);
          document.removeEventListener('visibilitychange', handleVisibility);
        };
      }
    };

    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (!user) {
        clearPresence();
        set({ user: null, profile: null, role: null, loading: false, ready: true });
        return;
      }

      try {
        const profile = await authService.loadProfile(user);
        setupPresence(user.uid);
        set({ user, profile, role: profile.role, loading: false, ready: true, error: null });
      } catch (error) {
        logFirebaseError('auth.initAuthListener.loadProfile', error);
        const message = firebaseErrorMessage(error);
        set({ user, profile: null, role: null, loading: false, ready: true, error: message });
      }
    });

    return () => {
      clearPresence();
      unsubscribe();
    };
  },
}));
