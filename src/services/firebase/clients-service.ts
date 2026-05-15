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
import type { Client, ClientStatus } from '@/src/data/clients';

export interface ClientInput {
  displayName: string;
  companyName?: string;
  email: string;
  phone?: string;
  status: ClientStatus;
}

const clientsCollection = () => collection(requireFirebase().db, 'clients');

const cleanClientInput = (input: ClientInput) => ({
  displayName: input.displayName.trim(),
  companyName: input.companyName?.trim() || '',
  email: input.email.trim().toLowerCase(),
  phone: input.phone?.trim() || '',
  status: input.status,
});

const cleanClientUpdate = (input: Partial<ClientInput>) => {
  const payload: Partial<ClientInput> = {};

  if (input.displayName !== undefined) payload.displayName = input.displayName.trim();
  if (input.companyName !== undefined) payload.companyName = input.companyName.trim();
  if (input.email !== undefined) payload.email = input.email.trim().toLowerCase();
  if (input.phone !== undefined) payload.phone = input.phone.trim();
  if (input.status !== undefined) payload.status = input.status;

  return payload;
};

const clientFromSnapshot = (
  snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
): Client => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    userId: data.userId ?? null,
    displayName: data.displayName ?? 'Unnamed client',
    companyName: data.companyName ?? '',
    email: data.email ?? '',
    phone: data.phone ?? '',
    role: 'user',
    status: data.status ?? 'active',
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
      snapshot => onClients(snapshot.docs.map(clientFromSnapshot)),
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

    await accessService.upsertAccess({
      email: payload.email,
      profileRole: 'user',
      clientId: ref.id,
      displayName: payload.displayName,
      status: payload.status === 'inactive' || payload.status === 'lost' ? 'inactive' : 'active',
    });

    return ref.id;
  },

  async updateClient(id: string, input: Partial<ClientInput>) {
    const ref = doc(requireFirebase().db, 'clients', id);
    const snapshot = await getDoc(ref);
    const previousEmail = snapshot.exists()
      ? normalizeAccessEmail(String(snapshot.data().email ?? ''))
      : '';
    const previous = snapshot.exists() ? clientFromSnapshot(snapshot) : null;
    const payload = cleanClientUpdate(input);

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
        profileRole: 'user',
        clientId: id,
        displayName: payload.displayName ?? previous?.displayName ?? nextEmail,
        status: (payload.status ?? previous?.status) === 'inactive' || (payload.status ?? previous?.status) === 'lost'
          ? 'inactive'
          : 'active',
      });
    }
  },

  async deleteClient(id: string) {
    const ref = doc(requireFirebase().db, 'clients', id);
    const snapshot = await getDoc(ref);
    const email = snapshot.exists() ? String(snapshot.data().email ?? '') : '';
    await deleteDoc(ref);
    if (email) await accessService.removeAccess(email);
  },
};
