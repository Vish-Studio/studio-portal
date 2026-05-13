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
import { requireFirebase } from './firebase-service';
import type { AuthProfile, AuthRole } from '@/src/types/auth';

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

const profileFromUserDocument = (user: User, data: Partial<AuthProfile>): AuthProfile => {
  const email = normalizeEmail(user.email);

  return {
    ...data,
    uid: user.uid,
    email: data.email ?? email,
    displayName: data.displayName ?? user.displayName ?? displayNameFromEmail(email),
    role: data.role ?? inferRole(email),
    status: data.status ?? 'active',
    createdAt: data.createdAt as Timestamp | undefined,
    updatedAt: data.updatedAt as Timestamp | undefined,
  };
};

export const authService = {
  async signIn(email: string, password: string) {
    const { auth } = requireFirebase();
    return signInWithEmailAndPassword(auth, email, password);
  },

  async signOut() {
    const { auth } = requireFirebase();
    await signOut(auth);
  },

  onAuthStateChanged(callback: (user: User | null) => void) {
    const { auth } = requireFirebase();
    return onAuthStateChanged(auth, callback);
  },

  async sendPasswordReset(email: string) {
    const { auth } = requireFirebase();

    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/reset-password`,
      handleCodeInApp: true,
    });
  },

  async verifyPasswordReset(code: string) {
    const { auth } = requireFirebase();
    return firebaseVerifyPasswordResetCode(auth, code);
  },

  async confirmPasswordReset(code: string, password: string) {
    const { auth } = requireFirebase();
    await firebaseConfirmPasswordReset(auth, code, password);
  },

  async upsertProfile(user: User): Promise<AuthProfile> {
    const { db } = requireFirebase();
    const email = normalizeEmail(user.email);
    const ref = doc(db, 'users', user.uid);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
      const profile = profileFromUserDocument(user, snapshot.data() as Partial<AuthProfile>);
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
  },
};
