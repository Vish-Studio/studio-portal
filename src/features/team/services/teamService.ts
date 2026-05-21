import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
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
      assignedProjectId: input.assignedProjectId ?? null,
      status: 'active',
      is_active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await setDoc(doc(db, 'team', user.uid), {
      id: user.uid,
      position,
      assignedProjectId: input.assignedProjectId ?? null,
    });

    return { id: user.uid, email, temporaryPassword };
  },

  async updateMember(id: string, input: Partial<TeamMemberInput>): Promise<void> {
    const { db } = requireFirebase();
    const userRef = doc(db, 'users', id);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      throw new Error('Team member profile was not found.');
    }

    const existing = userSnapshot.data();
    const name = input.name?.trim();
    const email = input.email?.trim().toLowerCase();
    const position = input.role?.trim();
    const role = input.accessRole
      ? input.accessRole === 'team' ? 'freelancer' : input.accessRole
      : String(existing.role ?? 'freelancer');
    const nextName = name || String(existing.name ?? existing.full_name ?? 'Unnamed member');
    const nextEmail = email || String(existing.email ?? '');
    const nextPosition = position !== undefined
      ? position
      : String(existing.job_title ?? existing.jobTitle ?? 'Team member');
    const nextStatus = existing.status === 'inactive' || existing.status === 'lost'
      ? existing.status
      : 'active';

    await setDoc(
      userRef,
      {
        uid: typeof existing.uid === 'string' ? existing.uid : id,
        name: nextName,
        full_name: nextName,
        email: nextEmail,
        role,
        needsPasswordChange: typeof existing.needsPasswordChange === 'boolean' ? existing.needsPasswordChange : false,
        job_title: nextPosition,
        status: nextStatus,
        is_active: existing.is_active !== false,
        createdAt: existing.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    if (position !== undefined) {
      await setDoc(doc(db, 'team', id), { id, position: nextPosition }, { merge: true });
    }
  },

  async deleteMember(id: string): Promise<void> {
    const { db } = requireFirebase();
    await deleteDoc(doc(db, 'users', id));
    await deleteDoc(doc(db, 'team', id));
  },

  async assignMember(memberId: string, projectId: string | null): Promise<void> {
    const { db } = requireFirebase();
    const userSnapshot = await getDoc(doc(db, 'users', memberId));
    const userData = userSnapshot.exists() ? userSnapshot.data() : {};
    const position = String(userData.job_title ?? userData.jobTitle ?? 'Team member');

    await setDoc(
      doc(db, 'users', memberId),
      {
        assignedProjectId: projectId,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    await setDoc(
      doc(db, 'team', memberId),
      {
        id: memberId,
        position,
        assignedProjectId: projectId,
      },
      { merge: true },
    );
  },
};
