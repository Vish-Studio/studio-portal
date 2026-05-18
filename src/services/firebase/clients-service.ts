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
import type { Client, ClientStatus } from "@/src/data/clients";

export interface ClientInput {
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  status: ClientStatus;
}

const clientsCollection = () => collection(requireFirebase().db, "clients");
const userProfileRef = (email: string) => doc(requireFirebase().db, "users", email.trim().toLowerCase());

const upsertClientUserProfile = async (
  profileId: string,
  payload: {
    email: string;
    role: "client";
    clientId: string;
    fullName: string;
    company: string;
    phone: string;
    status: "active" | "inactive";
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

const cleanClientInput = (input: ClientInput) => ({
  fullName: input.fullName.trim(),
  companyName: input.companyName?.trim() || "",
  email: input.email.trim().toLowerCase(),
  phone: input.phone?.trim() || "",
  status: input.status,
});

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

    const ref = await addDoc(clientsCollection(), {
      ...payload,
      userId: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await upsertClientUserProfile(payload.email, {
      email: payload.email,
      role: "client",
      clientId: ref.id,
      fullName: payload.fullName,
      company: payload.companyName,
      phone: payload.phone,
      status:
        payload.status === "inactive" || payload.status === "lost"
          ? "inactive"
          : "active",
    });

    return ref.id;
  },

  async updateClient(id: string, input: Partial<ClientInput>) {
    const ref = doc(requireFirebase().db, "clients", id);
    const snapshot = await getDoc(ref);
    const previousEmail = snapshot.exists()
      ? String(snapshot.data().email ?? "").trim().toLowerCase()
      : "";
    const previous = snapshot.exists() ? clientFromSnapshot(snapshot) : null;
    const payload = cleanClientUpdate(input);

    await updateDoc(ref, {
      ...payload,
      updatedAt: serverTimestamp(),
    });

    const nextEmail = (payload.email ?? previous?.email ?? "").trim().toLowerCase();
    if (previousEmail && nextEmail && previousEmail !== nextEmail) {
      await deleteDoc(userProfileRef(previousEmail));
    }

    if (nextEmail) {
      const profileStatus: "active" | "inactive" =
        (payload.status ?? previous?.status) === "inactive" ||
        (payload.status ?? previous?.status) === "lost"
          ? "inactive"
          : "active";
      const userProfilePayload = {
        email: nextEmail,
        role: "client" as const,
        clientId: id,
        fullName: payload.fullName ?? previous?.fullName ?? nextEmail,
        company: payload.companyName ?? previous?.companyName ?? "",
        phone: payload.phone ?? previous?.phone ?? "",
        status: profileStatus,
      };
      await upsertClientUserProfile(nextEmail, userProfilePayload);
      if (previous?.userId) {
        await upsertClientUserProfile(previous.userId, userProfilePayload);
      }
    }
  },

  async deleteClient(id: string) {
    const ref = doc(requireFirebase().db, "clients", id);
    const snapshot = await getDoc(ref);
    const email = snapshot.exists() ? String(snapshot.data().email ?? "") : "";
    await deleteDoc(ref);
    if (email) await deleteDoc(userProfileRef(email));
  },
};
