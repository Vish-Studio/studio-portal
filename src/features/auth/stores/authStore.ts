import { create } from 'zustand';
import type { User } from 'firebase/auth';
import { isFirebaseConfigured } from '@/src/firebase/config';
import { authService } from '../services/authService';
export type { AuthProfile, AuthRole } from '@/src/types/auth';
import type { AuthProfile, AuthProfileUpdateInput } from '@/src/types/auth';
import { runOperationWithFeedback } from '@/src/lib/operation-feedback';
import { FEEDBACK_MESSAGES } from '@/src/app/messages';
import { firebaseErrorMessage, logFirebaseError } from '@/src/lib/firebase-errors';

interface AuthState {
  user: User | null;
  profile: AuthProfile | null;
  loading: boolean;
  ready: boolean;
  error: string | null;
  role: AuthProfile['role'] | null;
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
  profile: null,
  loading: false,
  ready: false,
  error: null,
  role: null,

  signIn: async (email, password) => {
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
    await authService.signOut();
    set({ user: null, profile: null, role: null, error: null, ready: true });
  },

  initAuthListener: () => {
    if (!isFirebaseConfigured) {
      set({ ready: true, loading: false });
      return () => undefined;
    }

    set({ loading: true });

    return authService.onAuthStateChanged(async (user) => {
      if (!user) {
        set({ user: null, profile: null, role: null, loading: false, ready: true });
        return;
      }

      try {
        const profile = await authService.loadProfile(user);
        set({ user, profile, role: profile.role, loading: false, ready: true, error: null });
      } catch (error) {
        logFirebaseError('auth.initAuthListener.loadProfile', error);
        const message = firebaseErrorMessage(error);
        set({ user, profile: null, role: null, loading: false, ready: true, error: message });
      }
    });
  },
}));
