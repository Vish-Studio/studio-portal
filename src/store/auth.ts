import { create } from 'zustand';
import {
  confirmPasswordReset as firebaseConfirmPasswordReset,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  verifyPasswordResetCode as firebaseVerifyPasswordResetCode,
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type Timestamp,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/src/lib/firebase';

export type AuthRole = 'admin' | 'client';

export interface AuthProfile {
  uid: string;
  email: string;
  displayName: string;
  role: AuthRole;
  status: 'active' | 'inactive' | 'prospect' | 'agreed' | 'lost';
  clientId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

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
  signOutUser: () => Promise<void>;
  initAuthListener: () => () => void;
}

const fallbackAdminEmails = ['vishstudio.ltd@gmail.com', 'vishseenarain@gmail.com'];
const envAdminEmails = String(import.meta.env.VITE_FIREBASE_ADMIN_EMAILS ?? '')
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(Boolean);
const adminEmails = new Set([...fallbackAdminEmails, ...envAdminEmails]);

const normalizeEmail = (email?: string | null) => (email ?? '').trim().toLowerCase();

const displayNameFromEmail = (email: string) =>
  email
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ') || 'User';

const inferRole = (email: string): AuthRole =>
  adminEmails.has(normalizeEmail(email)) ? 'admin' : 'client';

const removeUndefined = <T extends Record<string, unknown>>(value: T) =>
  Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;

const ensureFirebase = () => {
  if (!auth || !db || !isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* values to your .env.local file.');
  }
  return { auth, db };
};

const upsertProfile = async (user: User): Promise<AuthProfile> => {
  const { db } = ensureFirebase();
  const email = normalizeEmail(user.email);
  const ref = doc(db, 'users', user.uid);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    const data = snapshot.data() as AuthProfile;
    const profile: AuthProfile = {
      ...data,
      uid: user.uid,
      email: data.email ?? email,
      displayName: data.displayName ?? user.displayName ?? displayNameFromEmail(email),
      role: data.role ?? inferRole(email),
      status: data.status ?? 'active',
    };

    await setDoc(ref, { updatedAt: serverTimestamp(), email: profile.email }, { merge: true });
    return profile;
  }

  const role = inferRole(email);
  const profile: AuthProfile = {
    uid: user.uid,
    email,
    displayName: user.displayName ?? displayNameFromEmail(email),
    role,
    status: 'active',
    clientId: role === 'client' ? user.uid : undefined,
  };

  await setDoc(ref, removeUndefined({
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }));

  return profile;
};

const firebaseErrorMessage = (error: unknown) => {
  if (!(error instanceof Error)) return 'Unable to sign in. Please try again.';
  if (error.message.includes('auth/invalid-credential')) return 'Invalid email or password.';
  if (error.message.includes('auth/operation-not-allowed')) return 'Email/password sign-in is not enabled in Firebase Authentication.';
  if (error.message.includes('auth/user-not-found')) return 'No user found with this email.';
  if (error.message.includes('auth/wrong-password')) return 'Invalid email or password.';
  if (error.message.includes('auth/too-many-requests')) return 'Too many attempts. Try again later.';
  if (error.message.includes('auth/invalid-email')) return 'Enter a valid email address.';
  return error.message;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: false,
  ready: false,
  error: null,

  signIn: async (email, password) => {
    const { auth } = ensureFirebase();
    set({ loading: true, error: null });

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const profile = await upsertProfile(credential.user);
      set({ user: credential.user, profile, loading: false, ready: true });
      return profile;
    } catch (error) {
      const message = firebaseErrorMessage(error);
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  sendPasswordReset: async (email) => {
    const { auth } = ensureFirebase();
    set({ loading: true, error: null });

    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      });
      set({ loading: false });
    } catch (error) {
      const message = firebaseErrorMessage(error);
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  verifyPasswordReset: async (code) => {
    const { auth } = ensureFirebase();

    try {
      return await firebaseVerifyPasswordResetCode(auth, code);
    } catch (error) {
      const message = firebaseErrorMessage(error);
      set({ error: message });
      throw new Error(message);
    }
  },

  confirmPasswordReset: async (code, password) => {
    const { auth } = ensureFirebase();
    set({ loading: true, error: null });

    try {
      await firebaseConfirmPasswordReset(auth, code, password);
      set({ loading: false });
    } catch (error) {
      const message = firebaseErrorMessage(error);
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  signOutUser: async () => {
    const { auth } = ensureFirebase();
    await signOut(auth);
    set({ user: null, profile: null, error: null, ready: true });
  },

  initAuthListener: () => {
    if (!auth || !isFirebaseConfigured) {
      set({ ready: true, loading: false });
      return () => undefined;
    }

    set({ loading: true });

    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        set({ user: null, profile: null, loading: false, ready: true });
        return;
      }

      try {
        const profile = await upsertProfile(user);
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
