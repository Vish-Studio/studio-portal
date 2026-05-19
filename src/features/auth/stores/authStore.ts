import { create } from 'zustand';
import type { User } from 'firebase/auth';
import { isFirebaseConfigured } from '@/src/firebase/config';
import { authService } from '../services/authService';
export type { AuthProfile, AuthRole } from '@/src/types/auth';
import type { AuthProfile, AuthProfileUpdateInput, AuthRole } from '@/src/types/auth';
import { runOperationWithFeedback } from '@/src/lib/operation-feedback';

interface AuthState {
  user: User | null;
  profile: AuthProfile | null;
  loading: boolean;
  ready: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<AuthProfile>;
  sendPasswordReset: (email: string) => Promise<void>;
  verifyPasswordReset: (code: string) => Promise<string>;
  confirmPasswordReset: (code: string, password: string) => Promise<void>;
  updateProfile: (updates: AuthProfileUpdateInput) => Promise<AuthProfile>;
  signOutUser: () => Promise<void>;
  initAuthListener: () => () => void;
}

const firebaseErrorMessage = (error: unknown) => {
  if (!(error instanceof Error)) return 'Unable to sign in. Please try again.';
  if (error.message.includes('auth/invalid-credential')) return 'Invalid email or password.';
  if (error.message.includes('auth/operation-not-allowed')) return 'Email/password sign-in is not enabled in Firebase Authentication.';
  if (error.message.includes('auth/user-not-found')) return 'No user found with this email.';
  if (error.message.includes('auth/wrong-password')) return 'Invalid email or password.';
  if (error.message.includes('auth/too-many-requests')) return 'Too many attempts. Try again later.';
  if (error.message.includes('auth/invalid-email')) return 'Enter a valid email address.';
  if (error.message.includes('auth/requires-recent-login')) return 'Please sign out and sign in again before changing your email.';
  if (error.message.includes('auth/email-already-in-use')) return 'This email is already used by another account.';
  return error.message;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: false,
  ready: false,
  error: null,

  signIn: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const credential = await authService.signInOrCreateAllowedUser(email, password);
      const profile = await authService.upsertProfile(credential.user);
      set({ user: credential.user, profile, loading: false, ready: true });
      return profile;
    } catch (error) {
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
      const message = firebaseErrorMessage(error);
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  verifyPasswordReset: async (code) => {
    try {
      return await authService.verifyPasswordReset(code);
    } catch (error) {
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
        successTitle: 'Profile updated',
        errorTitle: 'Unable to update profile',
        action: () => authService.updateCurrentProfile(updates),
      });
      set({ profile, loading: false });
      return profile;
    } catch (error) {
      const message = firebaseErrorMessage(error);
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  signOutUser: async () => {
    await authService.signOut();
    set({ user: null, profile: null, error: null, ready: true });
  },

  initAuthListener: () => {
    if (!isFirebaseConfigured) {
      set({ ready: true, loading: false });
      return () => undefined;
    }

    set({ loading: true });

    return authService.onAuthStateChanged(async (user) => {
      if (!user) {
        set({ user: null, profile: null, loading: false, ready: true });
        return;
      }

      try {
        const profile = await authService.upsertProfile(user);
        set({ user, profile, loading: false, ready: true });
      } catch (error) {
        set({
          user,
          profile: null,
          loading: false,
          ready: true,
          error: firebaseErrorMessage(error),
        });
      }
    });
  },
}));
