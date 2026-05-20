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
    const credential = await createUserWithEmailAndPassword(auth, email, input.password);

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
