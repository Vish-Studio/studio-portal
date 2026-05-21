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
    const position = input.role.trim();
    const role = input.accessRole === 'team' ? 'freelancer' : input.accessRole;
    const temporaryPassword = input.temporaryPassword?.trim();

    if (!name) throw new Error('Team member name is required.');
    if (!position) throw new Error('Team member role is required.');
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
      role,
      needsPasswordChange: true,
      full_name: name,
      job_title: position,
      status: 'active',
      is_active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await setDoc(doc(db, 'team', user.uid), {
      id: user.uid,
      position,
    });

    return { id: user.uid, email, temporaryPassword };
  },

  async updateMember(id: string, input: Partial<TeamMemberInput>): Promise<void> {
    const { db } = requireFirebase();
    const position = input.role?.trim();

    await updateDoc(doc(db, 'users', id), {
      ...(input.name?.trim() ? { name: input.name.trim() } : {}),
      ...(input.email?.trim() ? { email: input.email.trim().toLowerCase() } : {}),
      ...(input.accessRole ? { role: input.accessRole === 'team' ? 'freelancer' : input.accessRole } : {}),
      ...(input.name?.trim() ? { full_name: input.name.trim() } : {}),
      ...(position !== undefined ? { job_title: position } : {}),
      updatedAt: serverTimestamp(),
    });

    if (position !== undefined) {
      await setDoc(doc(db, 'team', id), { id, position }, { merge: true });
    }
  },

  async deleteMember(id: string): Promise<void> {
    await deleteDoc(doc(requireFirebase().db, 'users', id));
  },
};
