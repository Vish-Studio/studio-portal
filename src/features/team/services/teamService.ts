import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type FirestoreError,
  type Unsubscribe,
} from 'firebase/firestore';
import { requireFirebase } from '@/src/firebase/requireFirebase';
import { userProvisioningService } from '@/src/features/auth/services/userProvisioningService';
import { userDocToTeamMember } from '@/src/firebase/firestoreTransformers';
import type { TeamAccessRole, TeamMember } from '../types';

export interface TeamMemberInput {
  name: string;
  role: string;
  accessRole: TeamAccessRole;
  email: string;
  assignedProjectId?: string | null;
  temporaryPassword?: string;
}

export interface TeamMemberCreateResult {
  id: string;
  email: string;
  temporaryPassword: string;
}

const usersCollection = () => collection(requireFirebase().db, 'users');

export const teamService = {
  subscribeToMembers(
    onMembers: (members: TeamMember[]) => void,
    onError: (error: FirestoreError) => void,
  ): Unsubscribe {
    return onSnapshot(
      query(usersCollection(), where('role', 'in', ['superadmin', 'admin', 'freelancer', 'team'])),
      snapshot => onMembers(snapshot.docs.map(userDocToTeamMember)),
      onError,
    );
  },

  async createMember(input: TeamMemberInput): Promise<TeamMemberCreateResult> {
    const { db } = requireFirebase();
    const email = input.email.trim().toLowerCase();
    const name = input.name.trim();
    const temporaryPassword = input.temporaryPassword?.trim();

    if (!temporaryPassword) throw new Error('Temporary password is required to create a team member login.');

    const user = await userProvisioningService.createUser({
      email,
      password: temporaryPassword,
      displayName: name,
    });

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name,
      email,
      role: input.accessRole === 'team' ? 'freelancer' : input.accessRole,
      needsPasswordChange: true,
      createdAt: serverTimestamp(),
    });

    return { id: user.uid, email, temporaryPassword };
  },

  async updateMember(id: string, input: Partial<TeamMemberInput>): Promise<void> {
    await updateDoc(doc(requireFirebase().db, 'users', id), {
      ...(input.name?.trim() ? { name: input.name.trim() } : {}),
      ...(input.email?.trim() ? { email: input.email.trim().toLowerCase() } : {}),
      ...(input.accessRole ? { role: input.accessRole === 'team' ? 'freelancer' : input.accessRole } : {}),
    });
  },

  async deleteMember(id: string): Promise<void> {
    await deleteDoc(doc(requireFirebase().db, 'users', id));
  },
};
