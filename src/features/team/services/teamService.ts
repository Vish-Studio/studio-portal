import {
  addDoc,
  collection,
  deleteField,
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
import { userProvisioningService } from "@/src/features/auth/services/userProvisioningService";
import type { TeamAccessRole, TeamMember } from "../types";

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

const teamCollection = () => collection(requireFirebase().db, "team");
/** Look up a user profile by uid (the canonical key). */
const userProfileByUid = (uid: string) => doc(requireFirebase().db, "users", uid);

const legacyUserFieldDeletes = () => ({
  fullName: deleteField(),
  phone: deleteField(),
  jobTitle: deleteField(),
  company: deleteField(),
  recoveryEmail: deleteField(),
  newsletter: deleteField(),
  staffRole: deleteField(),
  teamId: deleteField(),
  teamMemberId: deleteField(),
  clientId: deleteField(),
  createdAt: deleteField(),
  updatedAt: deleteField(),
});

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return { first_name: parts[0] ?? "", last_name: parts.slice(1).join(" ") };
};

const upsertTeamUserProfile = async (
  profileId: string,
  payload: {
    email: string;
    role: TeamAccessRole;
    full_name: string;
    first_name: string;
    last_name: string;
    job_title: string;
    status: "active";
  },
) => {
  const ref = doc(requireFirebase().db, "users", profileId);
  const snapshot = await getDoc(ref);
  await setDoc(
    ref,
    {
      ...legacyUserFieldDeletes(),
      ...payload,
      id: profileId,
      feature_access: {},
      is_active: true,
      newsletterPreferences: false,
      ...(snapshot.exists() ? {} : { created_at: serverTimestamp() }),
      updated_at: serverTimestamp(),
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
    userId: data.userId ?? data.user_id ?? null,
    name: data.name ?? data.full_name ?? "Unnamed member",
    role: data.role ?? data.job_title ?? "Team member",
    accessRole: data.accessRole ?? "freelancer",
    email: data.email ?? "",
    assignedProjectId: data.assignedProjectId ?? null,
    createdAt: data.createdAt ?? data.created_at,
    updatedAt: data.updatedAt ?? data.updated_at,
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
    const temporaryPassword = input.temporaryPassword?.trim();

    if (!temporaryPassword) {
      throw new Error("Temporary password is required to create a team member login.");
    }

    const user = await userProvisioningService.createUser({
      email: payload.email,
      password: temporaryPassword,
      displayName: payload.name,
    });
    const nameParts = splitName(payload.name);
    const ref = await addDoc(teamCollection(), {
      ...payload,
      userId: user.uid,
      user_id: user.uid,
      full_name: payload.name,
      first_name: nameParts.first_name,
      last_name: nameParts.last_name,
      job_title: payload.role,
      status: "active",
      is_active: true,
      createdAt: serverTimestamp(),
      created_at: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    await upsertTeamUserProfile(user.uid, {
      email: payload.email,
      role: payload.accessRole,
      full_name: payload.name,
      first_name: nameParts.first_name,
      last_name: nameParts.last_name,
      job_title: payload.role,
      status: "active",
    });

    // Write the domain record ID back to the user profile so the
    // app can look up the team member record directly from the auth profile.
    await updateDoc(userProfileByUid(user.uid), {
      teamMemberId: ref.id,
    });

    return { id: ref.id, email: payload.email, temporaryPassword };
  },

  async updateMember(id: string, input: Partial<TeamMemberInput>) {
    const ref = doc(requireFirebase().db, "team", id);
    const snapshot = await getDoc(ref);
    const previous = snapshot.exists()
      ? teamMemberFromSnapshot(snapshot)
      : null;
    const payload = cleanTeamMemberUpdate(input);

    await updateDoc(ref, {
      ...payload,
      ...(payload.name !== undefined
        ? { full_name: payload.name, ...splitName(payload.name) }
        : {}),
      ...(payload.role !== undefined ? { job_title: payload.role } : {}),
      updatedAt: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    const shouldSyncAccess =
      payload.email !== undefined ||
      payload.name !== undefined ||
      payload.accessRole !== undefined;

    if (!shouldSyncAccess) return;

    const nextEmail = (payload.email ?? previous?.email ?? "").trim().toLowerCase();
    if (nextEmail) {
      const role = payload.accessRole ?? previous?.accessRole ?? "freelancer";
      const fullName = payload.name ?? previous?.name ?? nextEmail;
      const userProfilePayload = {
        email: nextEmail,
        role,
        full_name: fullName,
        ...splitName(fullName),
        job_title: payload.role ?? previous?.role ?? role,
        status: "active",
      } as const;
      // Always sync by uid (the canonical key).
      if (previous?.userId) {
        await upsertTeamUserProfile(previous.userId, userProfilePayload);
      }
    }
  },

  async deleteMember(id: string) {
    const ref = doc(requireFirebase().db, "team", id);
    const snapshot = await getDoc(ref);
    const userId = snapshot.exists()
      ? String(snapshot.data().userId ?? snapshot.data().user_id ?? "")
      : "";
    await deleteDoc(ref);
    if (userId) await deleteDoc(userProfileByUid(userId));
  },
};
