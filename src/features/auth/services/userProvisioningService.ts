import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { getProvisioningAuth } from '@/src/firebase/config';

interface ProvisionUserInput {
  email: string;
  password: string;
  displayName: string;
}

export interface ProvisionedUser {
  uid: string;
  email: string;
}

export const userProvisioningService = {
  async createUser(input: ProvisionUserInput): Promise<ProvisionedUser> {
    const auth = getProvisioningAuth();
    const email = input.email.trim().toLowerCase();

    let credential;
    try {
      credential = await createUserWithEmailAndPassword(auth, email, input.password);
    } catch (err: unknown) {
      // Surface Firebase Auth error codes as readable messages
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/email-already-in-use') {
        throw new Error(`An account with ${email} already exists. Use a different email or reset the existing account's password.`);
      }
      if (code === 'auth/weak-password') {
        throw new Error('Password is too weak. Use at least 6 characters.');
      }
      if (code === 'auth/operation-not-allowed') {
        throw new Error('Email/password sign-up is disabled in Firebase. Enable it in the Firebase console under Authentication → Sign-in methods.');
      }
      if (code === 'auth/invalid-api-key' || code === 'auth/invalid-app-credential') {
        throw new Error('Firebase is misconfigured. Check your VITE_FIREBASE_* environment variables.');
      }
      throw new Error(`Could not create user account: ${(err as Error).message ?? code}`);
    }

    if (input.displayName.trim()) {
      await updateProfile(credential.user, { displayName: input.displayName.trim() });
    }

    await signOut(auth);

    return {
      uid: credential.user.uid,
      email,
    };
  },
};
