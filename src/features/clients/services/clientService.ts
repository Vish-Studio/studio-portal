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
import type { Client, ClientStatus } from "../types";

export interface ClientInput {
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  status: ClientStatus;
  temporaryPassword?: string;
}

export interface ClientCreateResult {
  id: string;
  email: string;
  temporaryPassword: string;
}

const clientsCollection = () => collection(requireFirebase().db, "clients");
/** Look up a user profile by uid (the correct key). */
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

const upsertClientUserProfile = async (
  profileId: string,
  payload: {
    email: string;
    role: "client";
    full_name: string;
    first_name: string;
    last_name: string;
    company_name: string;
    phone_number: string;
    status: "active" | "inactive";
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
      is_active: payload.status === "active",
      newsletterPreferences: false,
      ...(snapshot.exists() ? {} : { created_at: serverTimestamp() }),
      updated_at: serverTimestamp(),
    },
    { merge: true },
  );
};

const cleanClientInput = (input: ClientInput) => ({
  fullName: input.fullName.trim(),
  companyName: input.companyName?.trim() || "",
  email: input.email.trim().toLowerCase(),
  phone: input.phone?.trim() || "",
  status: input.status,
});

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return { first_name: parts[0] ?? "", last_name: parts.slice(1).join(" ") };
};

const cleanClientUpdate = (input: Partial<ClientInput>) => {
  const payload: Partial<ClientInput> = {};

  if (input.fullName !== undefined) payload.fullName = input.fullName.trim();
  if (input.companyName !== undefined)
    payload.companyName = input.companyName.trim();
  if (input.email !== undefined)
    payload.email = input.email.trim().toLowerCase();
  if (input.phone !== undefined) payload.phone = input.phone.trim();
  if (input.status !== undefined) payload.status = input.status;

  return payload;
};

const clientFromSnapshot = (
  snapshot:
    | QueryDocumentSnapshot<DocumentData>
    | DocumentSnapshot<DocumentData>,
): Client => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    userId: data.userId ?? null,
    fullName: data.fullName ?? "Unnamed client",
    companyName: data.companyName ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    role: "client",
    status: data.status ?? "active",
    createdAt: data.createdAt,
  };
};

export const clientsService = {
  subscribeToClients(
    onClients: (clients: Client[]) => void,
    onError: (error: FirestoreError) => void,
  ): Unsubscribe {
    return onSnapshot(
      clientsCollection(),
      (snapshot) => onClients(snapshot.docs.map(clientFromSnapshot)),
      onError,
    );
  },

  async createClient(input: ClientInput) {
    const payload = cleanClientInput(input);
    const temporaryPassword = input.temporaryPassword?.trim();

    if (!temporaryPassword) {
      throw new Error("Temporary password is required to create a client login.");
    }

    const user = await userProvisioningService.createUser({
      email: payload.email,
      password: temporaryPassword,
      displayName: payload.fullName,
    });

    const ref = await addDoc(clientsCollection(), {
      ...payload,
      userId: user.uid,
      user_id: user.uid,
      full_name: payload.fullName,
      company_name: payload.companyName,
      phone_number: payload.phone,
      createdAt: serverTimestamp(),
      created_at: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    const nameParts = splitName(payload.fullName);

    await upsertClientUserProfile(user.uid, {
      email: payload.email,
      role: "client",
      full_name: payload.fullName,
      first_name: nameParts.first_name,
      last_name: nameParts.last_name,
      company_name: payload.companyName,
      phone_number: payload.phone,
      status:
        payload.status === "inactive" || payload.status === "lost"
          ? "inactive"
          : "active",
    });

    // Write the domain record ID back to the user profile so the
    // app can look up the client record directly from the auth profile.
    await updateDoc(doc(requireFirebase().db, "users", user.uid), {
      clientId: ref.id,
    });

    return { id: ref.id, email: payload.email, temporaryPassword };
  },

  async updateClient(id: string, input: Partial<ClientInput>) {
    const ref = doc(requireFirebase().db, "clients", id);
    const snapshot = await getDoc(ref);
    const previous = snapshot.exists() ? clientFromSnapshot(snapshot) : null;
    const payload = cleanClientUpdate(input);

    await updateDoc(ref, {
      ...payload,
      ...(payload.fullName !== undefined ? { full_name: payload.fullName } : {}),
      ...(payload.companyName !== undefined ? { company_name: payload.companyName } : {}),
      ...(payload.phone !== undefined ? { phone_number: payload.phone } : {}),
      updatedAt: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    const nextEmail = (payload.email ?? previous?.email ?? "").trim().toLowerCase();
    if (nextEmail) {
      const profileStatus: "active" | "inactive" =
        (payload.status ?? previous?.status) === "inactive" ||
        (payload.status ?? previous?.status) === "lost"
          ? "inactive"
          : "active";
      const userProfilePayload = {
        email: nextEmail,
        role: "client" as const,
        full_name: payload.fullName ?? previous?.fullName ?? nextEmail,
        ...splitName(payload.fullName ?? previous?.fullName ?? nextEmail),
        company_name: payload.companyName ?? previous?.companyName ?? "",
        phone_number: payload.phone ?? previous?.phone ?? "",
        status: profileStatus,
      };
      // Always sync by uid (the canonical key). Email was a legacy key — no longer used.
      if (previous?.userId) {
        await upsertClientUserProfile(previous.userId, userProfilePayload);
      }
    }
  },

  async deleteClient(id: string) {
    const ref = doc(requireFirebase().db, "clients", id);
    const snapshot = await getDoc(ref);
    const userId = snapshot.exists() ? String(snapshot.data().userId ?? snapshot.data().user_id ?? "") : "";
    await deleteDoc(ref);
    if (userId) await deleteDoc(userProfileByUid(userId));
  },
};
