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
import { userDocToClient } from '@/src/firebase/firestoreTransformers';
import type { Client } from '../types';

export interface ClientInput {
  fullName?: string;
  name?: string;
  email: string;
  companyName?: string;
  phone?: string;
  status?: Client['status'];
  temporaryPassword?: string;
}

export interface ClientCreateResult {
  id: string;
  email: string;
  temporaryPassword: string;
}

const usersCollection = () => collection(requireFirebase().db, 'users');

export const clientsService = {
  subscribeToClients(
    onClients: (clients: Client[]) => void,
    onError: (error: FirestoreError) => void,
  ): Unsubscribe {
    return onSnapshot(
      query(usersCollection(), where('role', '==', 'client')),
      snapshot => onClients(snapshot.docs.map(userDocToClient)),
      onError,
    );
  },

  async createClient(input: ClientInput): Promise<ClientCreateResult> {
    const { db } = requireFirebase();
    const email = input.email.trim().toLowerCase();
    const name = (input.name ?? input.fullName ?? '').trim();
    const temporaryPassword = input.temporaryPassword?.trim();

    if (!name) throw new Error('Client name is required.');
    if (!temporaryPassword) throw new Error('A temporary password is required to create a client login.');

    const user = await userProvisioningService.createUser({
      email,
      password: temporaryPassword,
      displayName: name,
    });

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name,
      email,
      role: 'client',
      needsPasswordChange: true,
      createdAt: serverTimestamp(),
    });

    return { id: user.uid, email, temporaryPassword };
  },

  async updateClient(id: string, updates: Partial<ClientInput>): Promise<void> {
    const name = (updates.name ?? updates.fullName)?.trim();
    const email = updates.email?.trim().toLowerCase();
    await updateDoc(doc(requireFirebase().db, 'users', id), {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
    });
  },

  async deleteClient(id: string): Promise<void> {
    await deleteDoc(doc(requireFirebase().db, 'users', id));
  },
};
