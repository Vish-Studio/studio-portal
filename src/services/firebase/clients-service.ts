import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
  type FirestoreError,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { requireFirebase } from './firebase-service';
import type { Client, ClientStatus } from '@/src/data/clients';

export interface ClientInput {
  displayName: string;
  companyName?: string;
  email: string;
  phone?: string;
  status: ClientStatus;
}

const clientsCollection = () => collection(requireFirebase().db, 'users');

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

const clientFromSnapshot = (snapshot: QueryDocumentSnapshot<DocumentData>): Client => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    displayName: data.displayName ?? 'Unnamed client',
    companyName: data.companyName ?? '',
    email: data.email ?? '',
    phone: data.phone ?? '',
    role: 'client',
    status: data.status ?? 'active',
    createdAt: data.createdAt,
  };
};

export const clientsService = {
  subscribeToClients(
    onClients: (clients: Client[]) => void,
    onError: (error: FirestoreError) => void,
  ): Unsubscribe {
    const clientsQuery = query(
      clientsCollection(),
      where('role', '==', 'client'),
    );

    return onSnapshot(
      clientsQuery,
      snapshot => onClients(snapshot.docs.map(clientFromSnapshot)),
      onError,
    );
  },

  async createClient(input: ClientInput) {
    const payload = cleanClientInput(input);

    const ref = await addDoc(clientsCollection(), {
      ...payload,
      role: 'client',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return ref.id;
  },

  async updateClient(id: string, input: Partial<ClientInput>) {
    const ref = doc(requireFirebase().db, 'users', id);
    const payload = cleanClientUpdate(input);

    await updateDoc(ref, {
      ...payload,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteClient(id: string) {
    const ref = doc(requireFirebase().db, 'users', id);
    await deleteDoc(ref);
  },
};
