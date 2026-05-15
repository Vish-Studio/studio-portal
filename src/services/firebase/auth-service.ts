import {
  confirmPasswordReset as firebaseConfirmPasswordReset,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile,
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
import type { AuthProfile, AuthProfileUpdateInput, AuthRole } from '@/src/types/auth';

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

const inferRole = (email: string): AuthRole => {
  const normalizedEmail = normalizeEmail(email);
  if (normalizedEmail === 'vishstudio.ltd@gmail.com') return 'superadmin';
  if (adminEmails.has(normalizedEmail)) return 'admin';
  return 'user';
};

const normalizeRole = (role: unknown, email: string): AuthRole => {
  if (role === 'client') return 'user';
  if (role === 'superadmin' || role === 'admin' || role === 'freelancer' || role === 'user') return role;
  return inferRole(email);
};

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
    role: normalizeRole(data.role, email),
    status: data.status ?? 'active',
    staffRole: data.staffRole,
    teamMemberId: data.teamMemberId,
    teamId: data.teamId ?? data.teamMemberId,
    clientId: data.clientId,
    phone: data.phone,
    jobTitle: data.jobTitle,
    company: data.company,
    recoveryEmail: data.recoveryEmail,
    newsletterPreferences: data.newsletterPreferences,
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
      staffRole: role === 'user' ? undefined : (access?.staffRole ?? role),
      teamId: access?.teamId ?? access?.teamMemberId,
      teamMemberId: access?.teamMemberId,
      clientId: access?.clientId,
      status: 'active',
    };

    await setDoc(ref, removeUndefined({
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }));

    if (profile.clientId) {
      await setDoc(doc(db, 'clients', profile.clientId), {
        userId: user.uid,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }

    if (profile.teamId) {
      await setDoc(doc(db, 'team', profile.teamId), {
        userId: user.uid,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }

    return profile;
  },

  async updateCurrentProfile(input: AuthProfileUpdateInput): Promise<AuthProfile> {
    const { auth, db } = requireFirebase();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('You need to be signed in to update your profile.');
    }

    if (typeof input.displayName === 'string' && input.displayName.trim()) {
      await firebaseUpdateProfile(user, { displayName: input.displayName.trim() });
    }

    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, removeUndefined({
      ...input,
      displayName: input.displayName?.trim(),
      updatedAt: serverTimestamp(),
    }), { merge: true });

    const snapshot = await getDoc(ref);
    return profileFromUserDocument(user, snapshot.data() as Partial<AuthProfile>);
  },
};
