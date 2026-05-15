import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type DocumentSnapshot,
  type FirestoreError,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { requireFirebase } from './firebase-service';
import { accessService, normalizeAccessEmail } from './access-service';
import type { TeamAccessRole, TeamMember } from '@/src/data/team';

export interface TeamMemberInput {
  name: string;
  role: string;
  accessRole: TeamAccessRole;
  email: string;
  assignedProjectId?: string | null;
}

const teamCollection = () => collection(requireFirebase().db, 'team');

const cleanTeamMemberInput = (input: TeamMemberInput) => ({
  name: input.name.trim(),
  role: input.role.trim(),
  accessRole: input.accessRole,
  email: input.email.trim().toLowerCase(),
  assignedProjectId: input.assignedProjectId ?? null,
});

const cleanTeamMemberUpdate = (input: Partial<TeamMemberInput>) => {
  const payload: Partial<TeamMemberInput> = {};

  if (input.name !== undefined) payload.name = input.name.trim();
  if (input.role !== undefined) payload.role = input.role.trim();
  if (input.accessRole !== undefined) payload.accessRole = input.accessRole;
  if (input.email !== undefined) payload.email = input.email.trim().toLowerCase();
  if (input.assignedProjectId !== undefined) payload.assignedProjectId = input.assignedProjectId;

  return payload;
};

const teamMemberFromSnapshot = (
  snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
): TeamMember => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    userId: data.userId ?? null,
    name: data.name ?? 'Unnamed member',
    role: data.role ?? 'Team member',
    accessRole: data.accessRole ?? 'freelancer',
    email: data.email ?? '',
    assignedProjectId: data.assignedProjectId ?? null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export const teamService = {
  subscribeToMembers(
    onMembers: (members: TeamMember[]) => void,
    onError: (error: FirestoreError) => void,
  ): Unsubscribe {
    return onSnapshot(
      teamCollection(),
      snapshot => onMembers(snapshot.docs.map(teamMemberFromSnapshot)),
      onError,
    );
  },

  async createMember(input: TeamMemberInput) {
    const payload = cleanTeamMemberInput(input);
    const ref = await addDoc(teamCollection(), {
      ...payload,
      userId: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await accessService.upsertAccess({
      email: payload.email,
      profileRole: payload.accessRole,
      staffRole: payload.accessRole,
      teamId: ref.id,
      displayName: payload.name,
      status: 'active',
    });

    return ref.id;
  },

  async updateMember(id: string, input: Partial<TeamMemberInput>) {
    const ref = doc(requireFirebase().db, 'team', id);
    const snapshot = await getDoc(ref);
    const previousEmail = snapshot.exists()
      ? normalizeAccessEmail(String(snapshot.data().email ?? ''))
      : '';
    const previous = snapshot.exists() ? teamMemberFromSnapshot(snapshot) : null;
    const payload = cleanTeamMemberUpdate(input);

    await updateDoc(ref, {
      ...payload,
      updatedAt: serverTimestamp(),
    });

    const nextEmail = normalizeAccessEmail(payload.email ?? previous?.email ?? '');
    if (previousEmail && nextEmail && previousEmail !== nextEmail) {
      await accessService.removeAccess(previousEmail);
    }

    if (nextEmail) {
      await accessService.upsertAccess({
        email: nextEmail,
        profileRole: payload.accessRole ?? previous?.accessRole ?? 'freelancer',
        staffRole: payload.accessRole ?? previous?.accessRole ?? 'freelancer',
        teamId: id,
        displayName: payload.name ?? previous?.name ?? nextEmail,
        status: 'active',
      });
    }
  },

  async deleteMember(id: string) {
    const ref = doc(requireFirebase().db, 'team', id);
    const snapshot = await getDoc(ref);
    const email = snapshot.exists() ? String(snapshot.data().email ?? '') : '';
    await deleteDoc(ref);
    if (email) await accessService.removeAccess(email);
  },
};
