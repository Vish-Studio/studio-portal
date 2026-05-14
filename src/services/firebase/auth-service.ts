import {
  confirmPasswordReset as firebaseConfirmPasswordReset,
  createUserWithEmailAndPassword,
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
import { accessService } from './access-service';
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

  async signInOrCreateAllowedUser(email: string, password: string) {
    const { auth } = requireFirebase();
    const normalizedEmail = normalizeEmail(email);

    try {
      return await signInWithEmailAndPassword(auth, normalizedEmail, password);
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      const canTryCreate =
        message.includes('auth/user-not-found') ||
        message.includes('auth/invalid-credential') ||
        message.includes('auth/wrong-password');

      if (!canTryCreate) throw error;

      const access = await accessService.getAccess(normalizedEmail);
      if (!access || access.status !== 'active') {
        throw new Error('No active account invitation exists for this email.');
      }

      try {
        return await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      } catch (createError) {
        const createMessage = createError instanceof Error ? createError.message : '';
        if (createMessage.includes('auth/email-already-in-use')) {
          throw new Error('Invalid email or password.');
        }
        throw createError;
      }
    }
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

    const access = await accessService.getAccess(email);
    const role = access?.profileRole ?? inferRole(email);
    const profile: AuthProfile = {
      uid: user.uid,
      email,
      displayName: user.displayName ?? access?.displayName ?? displayNameFromEmail(email),
      role,
      staffRole: access?.staffRole,
      teamMemberId: access?.teamMemberId,
      clientId: access?.clientId ?? (role === 'client' ? user.uid : undefined),
      status: 'active',
    };

    await setDoc(ref, removeUndefined({
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }));

    return profile;
  },
};
