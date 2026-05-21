import {
  confirmPasswordReset as firebaseConfirmPasswordReset,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
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
import { requireFirebase } from '@/src/firebase/requireFirebase';
import type { AuthProfile, AuthProfileUpdateInput, AuthRole } from '@/src/types/auth';

const normalizeEmail = (email?: string | null) => (email ?? '').trim().toLowerCase();

const roleFromValue = (value: unknown): AuthRole => {
  if (
    value === 'superadmin' ||
    value === 'admin' ||
    value === 'freelancer' ||
    value === 'team' ||
    value === 'client'
  ) return value;
  return 'client';
};

const nameFromEmail = (email: string) =>
  email.split('@')[0].split(/[._-]/).filter(Boolean)
    .map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ') || 'User';

const profileFromSnapshot = (user: User, data: Record<string, unknown>): AuthProfile => {
  const email = normalizeEmail(user.email || String(data.email ?? ''));
  const name = String(data.name ?? data.full_name ?? user.displayName ?? nameFromEmail(email));
  const role = roleFromValue(data.role);

  return {
    id: user.uid,
    uid: user.uid,
    email: String(data.email ?? email),
    name,
    fullName: name,
    role,
    staffRole: role === 'client' ? undefined : role,
    needsPasswordChange: typeof data.needsPasswordChange === 'boolean' ? data.needsPasswordChange : false,
    createdAt: data.createdAt as AuthProfile['createdAt'],
    created_at: data.created_at as Timestamp | undefined,
    updated_at: data.updated_at as Timestamp | undefined,
    full_name: name,
    first_name: typeof data.first_name === 'string' ? data.first_name : undefined,
    last_name: typeof data.last_name === 'string' ? data.last_name : undefined,
    recovery_email: typeof data.recovery_email === 'string' ? data.recovery_email : undefined,
    gender: typeof data.gender === 'string' ? data.gender : undefined,
    phone_number: typeof data.phone_number === 'string' ? data.phone_number : undefined,
    company_name: typeof data.company_name === 'string' ? data.company_name : undefined,
    job_title: typeof data.job_title === 'string' ? data.job_title : undefined,
    jobTitle: typeof data.job_title === 'string' ? data.job_title : undefined,
    newsletterPreferences: typeof data.newsletterPreferences === 'boolean' ? data.newsletterPreferences : false,
    feature_access: data.feature_access as AuthProfile['feature_access'],
    is_active: typeof data.is_active === 'boolean' ? data.is_active : undefined,
    status: data.status as AuthProfile['status'],
  };
};

export const authService = {
  async signIn(email: string, password: string) {
    const { auth } = requireFirebase();
    return signInWithEmailAndPassword(auth, normalizeEmail(email), password);
  },

  async signInOrCreateAllowedUser(email: string, password: string) {
    const { auth } = requireFirebase();
    return signInWithEmailAndPassword(auth, normalizeEmail(email), password);
  },

  async signOut() {
    const { auth } = requireFirebase();
    await signOut(auth);
  },

  onAuthStateChanged(callback: (user: User | null) => void) {
    const { auth } = requireFirebase();
    return onAuthStateChanged(auth, callback);
  },

  async loadProfile(user: User): Promise<AuthProfile> {
    const { db } = requireFirebase();
    const profileRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(profileRef);

    if (!snapshot.exists()) {
      throw new Error('No app profile exists for this Firebase user.');
    }

    const data = snapshot.data();
    if (typeof data.needsPasswordChange !== 'boolean') {
      const email = normalizeEmail(user.email || String(data.email ?? ''));
      const name = String(data.name ?? data.full_name ?? user.displayName ?? nameFromEmail(email));
      await setDoc(
        profileRef,
        {
          uid: typeof data.uid === 'string' ? data.uid : user.uid,
          name,
          email: normalizeEmail(String(data.email ?? email)),
          role: roleFromValue(data.role),
          needsPasswordChange: false,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      return profileFromSnapshot(user, { ...data, needsPasswordChange: false });
    }

    return profileFromSnapshot(user, data);
  },

  async sendPasswordReset(email: string) {
    const { auth } = requireFirebase();
    await sendPasswordResetEmail(auth, normalizeEmail(email), {
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

  async completeRequiredPasswordChange(password: string): Promise<AuthProfile> {
    const { auth, db } = requireFirebase();
    const user = auth.currentUser;
    if (!user) throw new Error('You need to be signed in to change your password.');

    const profileRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(profileRef);
    if (!snapshot.exists()) throw new Error('No app profile exists for this Firebase user.');

    await updatePassword(user, password);

    const existing = snapshot.data();
    const email = normalizeEmail(String(existing.email ?? user.email ?? ''));
    const name = String(existing.name ?? existing.full_name ?? user.displayName ?? nameFromEmail(email));

    await setDoc(
      profileRef,
      {
        uid: typeof existing.uid === 'string' ? existing.uid : user.uid,
        name,
        email,
        role: roleFromValue(existing.role),
        needsPasswordChange: false,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return this.loadProfile(user);
  },

  async updateCurrentProfile(input: AuthProfileUpdateInput): Promise<AuthProfile> {
    const { auth, db } = requireFirebase();
    const user = auth.currentUser;
    if (!user) throw new Error('You need to be signed in to update your profile.');

    const email = input.email?.trim().toLowerCase();
    const name = (input.name ?? input.fullName ?? input.full_name)?.trim();
    const snapshot = await getDoc(doc(db, 'users', user.uid));
    if (!snapshot.exists()) throw new Error('No app profile exists for this Firebase user.');

    const existing = snapshot.data();
    const currentEmail = normalizeEmail(String(existing.email ?? user.email ?? ''));
    const nextName = name || String(existing.name ?? existing.full_name ?? user.displayName ?? nameFromEmail(currentEmail));

    if (name) await firebaseUpdateProfile(user, { displayName: name });
    if (email && email !== currentEmail) {
      throw new Error('Email changes are restricted by Firestore rules. Update the primary email through an admin workflow.');
    }

    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: typeof existing.uid === 'string' ? existing.uid : user.uid,
        name: nextName,
        email: currentEmail,
        role: roleFromValue(existing.role),
        needsPasswordChange: typeof existing.needsPasswordChange === 'boolean' ? existing.needsPasswordChange : false,
        full_name: nextName,
        first_name: input.first_name?.trim() ?? existing.first_name ?? '',
        last_name: input.last_name?.trim() ?? existing.last_name ?? '',
        recovery_email: input.recovery_email?.trim().toLowerCase() ?? existing.recovery_email ?? '',
        gender: input.gender ?? existing.gender ?? '',
        phone_number: input.phone_number?.trim() ?? existing.phone_number ?? '',
        company_name: input.company_name?.trim() ?? existing.company_name ?? '',
        job_title: (input.job_title ?? input.jobTitle)?.trim() ?? existing.job_title ?? '',
        newsletterPreferences: input.newsletterPreferences ?? existing.newsletterPreferences ?? false,
        feature_access: existing.feature_access ?? {},
        is_active: typeof existing.is_active === 'boolean' ? existing.is_active : true,
        status: existing.status ?? 'active',
        createdAt: existing.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return this.loadProfile(user);
  },
};
