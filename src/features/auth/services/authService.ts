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
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { requireFirebase } from '@/src/firebase/requireFirebase';
import type { AuthProfile, AuthProfileUpdateInput, AuthRole } from '@/src/types/auth';
import { FEEDBACK_MESSAGES } from '@/src/app/messages';
import { isFirebasePermissionError, logFirebaseError } from '@/src/lib/firebase-errors';
import { randomAvatarTone } from '@/src/shared/components/avatar/avatar';

const normalizeEmail = (email?: string | null) => (email ?? '').trim().toLowerCase();
const SUPERADMIN_EMAILS = new Set([
  'vishseenarain@gmail.com',
  'vishstudio.ltd@gmail.com',
  'vishroy@vish.studio',
  'divesh@vish.studio',
]);

const roleFromValue = (value: unknown, email?: string): AuthRole => {
  if (SUPERADMIN_EMAILS.has(normalizeEmail(email))) return 'superadmin';
  if (value === 'superadmin') return value;
  return 'user';
};

const nameFromEmail = (email: string) =>
  email.split('@')[0].split(/[._-]/).filter(Boolean)
    .map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ') || 'User';

const legacyUserFieldDeletes = {
  id: deleteField(),
  name: deleteField(),
  full_name: deleteField(),
  first_name: deleteField(),
  last_name: deleteField(),
  recovery_email: deleteField(),
  phone_number: deleteField(),
  company_name: deleteField(),
  created_at: deleteField(),
  updated_at: deleteField(),
  feature_access: deleteField(),
  is_active: deleteField(),
  job_title: deleteField(),
};

const profileFromSnapshot = (user: User, data: Record<string, unknown>): AuthProfile => {
  const email = normalizeEmail(user.email || String(data.email ?? ''));
  const fullName = String(data.fullName ?? data.full_name ?? data.name ?? user.displayName ?? nameFromEmail(email));
  const role = roleFromValue(data.role, email);

  return {
    id: user.uid,
    uid: user.uid,
    email: String(data.email ?? email),
    fullName,
    role,
    staffRole: role === 'user' ? undefined : role,
    needsPasswordChange: typeof data.needsPasswordChange === 'boolean' ? data.needsPasswordChange : false,
    createdAt: data.createdAt as AuthProfile['createdAt'],
    updatedAt: data.updatedAt as AuthProfile['updatedAt'],
    firstName: typeof data.firstName === 'string' ? data.firstName : typeof data.first_name === 'string' ? data.first_name : undefined,
    lastName: typeof data.lastName === 'string' ? data.lastName : typeof data.last_name === 'string' ? data.last_name : undefined,
    recoveryEmail: typeof data.recoveryEmail === 'string' ? data.recoveryEmail : typeof data.recovery_email === 'string' ? data.recovery_email : undefined,
    gender: typeof data.gender === 'string' ? data.gender : undefined,
    phoneNumber: typeof data.phoneNumber === 'string' ? data.phoneNumber : typeof data.phone_number === 'string' ? data.phone_number : undefined,
    companyName: typeof data.companyName === 'string' ? data.companyName : typeof data.company_name === 'string' ? data.company_name : undefined,
    jobTitle: typeof data.jobTitle === 'string' ? data.jobTitle : typeof data.job_title === 'string' ? data.job_title : undefined,
    avatarColor: typeof data.avatarColor === 'string' ? data.avatarColor : undefined,
    newsletterPreferences: typeof data.newsletterPreferences === 'boolean' ? data.newsletterPreferences : false,
    featureAccess: (data.featureAccess ?? data.feature_access) as AuthProfile['featureAccess'],
    isActive: typeof data.isActive === 'boolean' ? data.isActive : typeof data.is_active === 'boolean' ? data.is_active : undefined,
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
    if (auth.currentUser) {
      await this.setPresence(auth.currentUser.uid, false).catch(error => {
        logFirebaseError('auth.signOut.setPresence', error);
      });
    }
    await signOut(auth);
  },

  async setPresence(uid: string, isOnline: boolean) {
    const { db } = requireFirebase();
    await setDoc(
      doc(db, 'users', uid),
      {
        isOnline,
        lastOnlineAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  },

  onAuthStateChanged(callback: (user: User | null) => void) {
    const { auth } = requireFirebase();
    return onAuthStateChanged(auth, callback);
  },

  async loadProfile(user: User): Promise<AuthProfile> {
    const { db } = requireFirebase();
    const profileRef = doc(db, 'users', user.uid);
    let snapshot = await getDoc(profileRef);

    if (!snapshot.exists()) {
      const email = normalizeEmail(user.email);
      const matchingProfiles = await getDocs(query(collection(db, 'users'), where('email', '==', email)));
      const matchingProfile = matchingProfiles.docs[0];

      if (matchingProfile) {
        const data = matchingProfile.data();
        await setDoc(profileRef, {
          uid: user.uid,
          fullName: String(data.fullName ?? data.full_name ?? data.name ?? user.displayName ?? nameFromEmail(email)),
          email,
          role: roleFromValue(data.role, email),
          needsPasswordChange: typeof data.needsPasswordChange === 'boolean' ? data.needsPasswordChange : false,
          firstName: data.firstName ?? data.first_name ?? '',
          lastName: data.lastName ?? data.last_name ?? '',
          recoveryEmail: data.recoveryEmail ?? data.recovery_email ?? '',
          gender: data.gender ?? '',
          phoneNumber: data.phoneNumber ?? data.phone_number ?? '',
          companyName: data.companyName ?? data.company_name ?? '',
          jobTitle: data.jobTitle ?? data.job_title ?? '',
          avatarColor: typeof data.avatarColor === 'string' ? data.avatarColor : randomAvatarTone(),
          newsletterPreferences: data.newsletterPreferences ?? false,
          featureAccess: data.featureAccess ?? data.feature_access ?? {},
          isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
          status: data.status ?? 'active',
          createdAt: data.createdAt ?? serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        snapshot = await getDoc(profileRef);
      }
    }

    if (!snapshot.exists()) {
      const email = normalizeEmail(user.email);
      if (!SUPERADMIN_EMAILS.has(email)) {
        const fullName = user.displayName || nameFromEmail(email);
        await setDoc(profileRef, {
          uid: user.uid,
          fullName,
          email,
          role: 'user',
          needsPasswordChange: false,
          avatarColor: randomAvatarTone(),
          newsletterPreferences: false,
          featureAccess: {},
          isActive: true,
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return this.loadProfile(user);
      }

      const fullName = user.displayName || nameFromEmail(email);
      await setDoc(profileRef, {
        uid: user.uid,
        fullName,
        email,
        role: 'superadmin',
        needsPasswordChange: false,
        avatarColor: randomAvatarTone(),
        newsletterPreferences: false,
        featureAccess: {},
        isActive: true,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return this.loadProfile(user);
    }

    const data = snapshot.data();
    const email = normalizeEmail(user.email || String(data.email ?? ''));

    if (SUPERADMIN_EMAILS.has(email) && data.role !== 'superadmin') {
      await setDoc(
        profileRef,
        {
          uid: typeof data.uid === 'string' ? data.uid : user.uid,
          fullName: String(data.fullName ?? data.full_name ?? data.name ?? user.displayName ?? nameFromEmail(email)),
          email,
          role: 'superadmin',
          needsPasswordChange: typeof data.needsPasswordChange === 'boolean' ? data.needsPasswordChange : false,
          updatedAt: serverTimestamp(),
          ...legacyUserFieldDeletes,
        },
        { merge: true },
      );
      return this.loadProfile(user);
    }

    if (typeof data.needsPasswordChange !== 'boolean') {
      const email = normalizeEmail(user.email || String(data.email ?? ''));
      const fullName = String(data.fullName ?? data.full_name ?? data.name ?? user.displayName ?? nameFromEmail(email));
      try {
        await setDoc(
          profileRef,
          {
            uid: typeof data.uid === 'string' ? data.uid : user.uid,
            fullName,
            email: normalizeEmail(String(data.email ?? email)),
            role: roleFromValue(data.role, email),
            needsPasswordChange: false,
            updatedAt: serverTimestamp(),
            ...legacyUserFieldDeletes,
          },
          { merge: true },
        );
      } catch (error) {
        logFirebaseError('auth.loadProfile.migrateNeedsPasswordChange', error);
        if (!isFirebasePermissionError(error)) throw error;
      }
      return profileFromSnapshot(user, { ...data, needsPasswordChange: false });
    }

    const hasLegacyFields = [
      'id',
      'name',
      'full_name',
      'first_name',
      'last_name',
      'recovery_email',
      'phone_number',
      'company_name',
      'created_at',
      'updated_at',
      'feature_access',
      'is_active',
      'job_title',
    ].some(key => key in data);

    if (data.needsPasswordChange === false && (typeof data.fullName !== 'string' || hasLegacyFields)) {
      const email = normalizeEmail(user.email || String(data.email ?? ''));
      const fullName = String(data.fullName ?? data.full_name ?? data.name ?? user.displayName ?? nameFromEmail(email));
      try {
        await setDoc(
          profileRef,
          {
            uid: typeof data.uid === 'string' ? data.uid : user.uid,
            fullName,
            email: normalizeEmail(String(data.email ?? email)),
            role: roleFromValue(data.role, email),
            needsPasswordChange: false,
            firstName: data.firstName ?? data.first_name ?? '',
            lastName: data.lastName ?? data.last_name ?? '',
            recoveryEmail: data.recoveryEmail ?? data.recovery_email ?? '',
            gender: data.gender ?? '',
            phoneNumber: data.phoneNumber ?? data.phone_number ?? '',
            companyName: data.companyName ?? data.company_name ?? '',
            jobTitle: data.jobTitle ?? data.job_title ?? '',
            avatarColor: typeof data.avatarColor === 'string' ? data.avatarColor : randomAvatarTone(),
            newsletterPreferences: data.newsletterPreferences ?? false,
            featureAccess: data.featureAccess ?? data.feature_access ?? {},
            isActive: typeof data.isActive === 'boolean'
              ? data.isActive
              : typeof data.is_active === 'boolean'
                ? data.is_active
                : true,
            status: data.status ?? 'active',
            createdAt: data.createdAt ?? serverTimestamp(),
            updatedAt: serverTimestamp(),
            ...legacyUserFieldDeletes,
          },
          { merge: true },
        );

        return this.loadProfile(user);
      } catch (error) {
        logFirebaseError('auth.loadProfile.migrateLegacyFields', error);
        if (!isFirebasePermissionError(error)) throw error;
      }
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
    if (!user) throw new Error(FEEDBACK_MESSAGES.auth.signedOutPasswordChange);

    const profileRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(profileRef);
    if (!snapshot.exists()) throw new Error(FEEDBACK_MESSAGES.auth.noProfile);

    await updatePassword(user, password);

    const existing = snapshot.data();
    const email = normalizeEmail(String(existing.email ?? user.email ?? ''));
    const fullName = String(existing.fullName ?? existing.full_name ?? existing.name ?? user.displayName ?? nameFromEmail(email));

    await setDoc(
      profileRef,
      {
        uid: typeof existing.uid === 'string' ? existing.uid : user.uid,
        fullName,
        email,
        role: roleFromValue(existing.role, email),
        needsPasswordChange: false,
        updatedAt: serverTimestamp(),
        ...legacyUserFieldDeletes,
      },
      { merge: true },
    );

    return this.loadProfile(user);
  },

  async updateCurrentProfile(input: AuthProfileUpdateInput): Promise<AuthProfile> {
    const { auth, db } = requireFirebase();
    const user = auth.currentUser;
    if (!user) throw new Error(FEEDBACK_MESSAGES.auth.signedOutProfileUpdate);

    const email = input.email?.trim().toLowerCase();
    const fullName = input.fullName?.trim();
    const snapshot = await getDoc(doc(db, 'users', user.uid));
    if (!snapshot.exists()) throw new Error(FEEDBACK_MESSAGES.auth.noProfile);

    const existing = snapshot.data();
    const currentEmail = normalizeEmail(String(existing.email ?? user.email ?? ''));
    const nextFullName = fullName || String(existing.fullName ?? existing.full_name ?? existing.name ?? user.displayName ?? nameFromEmail(currentEmail));

    if (fullName) await firebaseUpdateProfile(user, { displayName: fullName });
    if (email && email !== currentEmail) {
      throw new Error(FEEDBACK_MESSAGES.auth.emailChangeRestricted);
    }

    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: typeof existing.uid === 'string' ? existing.uid : user.uid,
        fullName: nextFullName,
        email: currentEmail,
        role: roleFromValue(existing.role, currentEmail),
        needsPasswordChange: typeof existing.needsPasswordChange === 'boolean' ? existing.needsPasswordChange : false,
        firstName: input.firstName?.trim() ?? existing.firstName ?? existing.first_name ?? '',
        lastName: input.lastName?.trim() ?? existing.lastName ?? existing.last_name ?? '',
        recoveryEmail: input.recoveryEmail?.trim().toLowerCase() ?? existing.recoveryEmail ?? existing.recovery_email ?? '',
        gender: input.gender ?? existing.gender ?? '',
        phoneNumber: input.phoneNumber?.trim() ?? existing.phoneNumber ?? existing.phone_number ?? '',
        companyName: input.companyName?.trim() ?? existing.companyName ?? existing.company_name ?? '',
        jobTitle: input.jobTitle?.trim() ?? existing.jobTitle ?? existing.job_title ?? '',
        avatarColor: typeof existing.avatarColor === 'string' ? existing.avatarColor : randomAvatarTone(),
        newsletterPreferences: input.newsletterPreferences ?? existing.newsletterPreferences ?? false,
        featureAccess: input.featureAccess ?? existing.featureAccess ?? existing.feature_access ?? {},
        isActive: typeof input.isActive === 'boolean'
          ? input.isActive
          : typeof existing.isActive === 'boolean'
            ? existing.isActive
            : typeof existing.is_active === 'boolean'
              ? existing.is_active
              : true,
        status: existing.status ?? 'active',
        createdAt: existing.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...legacyUserFieldDeletes,
      },
      { merge: true },
    );

    return this.loadProfile(user);
  },
};
