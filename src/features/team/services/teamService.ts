import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type DocumentSnapshot,
  type FirestoreError,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { requireFirebase } from "@/src/firebase/requireFirebase";
import type { TeamAccessRole, TeamMember } from "../types";

export interface TeamMemberInput {
  name: string;
  role: string;
  accessRole: TeamAccessRole;
  email: string;
  assignedProjectId?: string | null;
}

const teamCollection = () => collection(requireFirebase().db, "team");
const userProfileRef = (email: string) => doc(requireFirebase().db, "users", email.trim().toLowerCase());

const upsertTeamUserProfile = async (
  profileId: string,
  payload: {
    email: string;
    role: TeamAccessRole;
    staffRole: TeamAccessRole;
    teamId: string;
    teamMemberId: string;
    fullName: string;
    jobTitle: string;
    status: "active";
  },
) => {
  const ref = doc(requireFirebase().db, "users", profileId);
  const snapshot = await getDoc(ref);
  await setDoc(
    ref,
    {
      ...payload,
      ...(snapshot.exists() ? {} : { createdAt: serverTimestamp() }),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

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
  if (input.email !== undefined)
    payload.email = input.email.trim().toLowerCase();
  if (input.assignedProjectId !== undefined)
    payload.assignedProjectId = input.assignedProjectId;

  return payload;
};

const teamMemberFromSnapshot = (
  snapshot:
    | QueryDocumentSnapshot<DocumentData>
    | DocumentSnapshot<DocumentData>,
): TeamMember => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    userId: data.userId ?? null,
    name: data.name ?? "Unnamed member",
    role: data.role ?? "Team member",
    accessRole: data.accessRole ?? "freelancer",
    email: data.email ?? "",
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
      (snapshot) => onMembers(snapshot.docs.map(teamMemberFromSnapshot)),
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

    await upsertTeamUserProfile(payload.email, {
      email: payload.email,
      role: payload.accessRole,
      staffRole: payload.accessRole,
      teamId: ref.id,
      teamMemberId: ref.id,
      fullName: payload.name,
      jobTitle: payload.role,
      status: "active",
    });

    return ref.id;
  },

  async updateMember(id: string, input: Partial<TeamMemberInput>) {
    const ref = doc(requireFirebase().db, "team", id);
    const snapshot = await getDoc(ref);
    const previousEmail = snapshot.exists()
      ? String(snapshot.data().email ?? "").trim().toLowerCase()
      : "";
    const previous = snapshot.exists()
      ? teamMemberFromSnapshot(snapshot)
      : null;
    const payload = cleanTeamMemberUpdate(input);

    await updateDoc(ref, {
      ...payload,
      updatedAt: serverTimestamp(),
    });

    const shouldSyncAccess =
      payload.email !== undefined ||
      payload.name !== undefined ||
      payload.accessRole !== undefined;

    if (!shouldSyncAccess) return;

    const nextEmail = (payload.email ?? previous?.email ?? "").trim().toLowerCase();
    if (previousEmail && nextEmail && previousEmail !== nextEmail) {
      await deleteDoc(userProfileRef(previousEmail));
    }
    if (nextEmail) {
      const role = payload.accessRole ?? previous?.accessRole ?? "freelancer";
      const userProfilePayload = {
        email: nextEmail,
        role,
        staffRole: role,
        teamId: id,
        teamMemberId: id,
        fullName: payload.name ?? previous?.name ?? nextEmail,
        jobTitle: payload.role ?? previous?.role ?? role,
        status: "active",
      } as const;
      await upsertTeamUserProfile(nextEmail, userProfilePayload);
      if (previous?.userId) {
        await upsertTeamUserProfile(previous.userId, userProfilePayload);
      }
    }
  },

  async deleteMember(id: string) {
    const ref = doc(requireFirebase().db, "team", id);
    const snapshot = await getDoc(ref);
    const email = snapshot.exists() ? String(snapshot.data().email ?? "") : "";
    await deleteDoc(ref);
    if (email) await deleteDoc(userProfileRef(email));
  },
};
