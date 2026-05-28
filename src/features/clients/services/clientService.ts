import {
  collection,
  deleteField,
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
import { userDocToClient } from '@/src/firebase/firestoreTransformers';
import type { Client } from '../types';

export interface ClientInput {
  fullName?: string;
  name?: string;
  email: string;
  companyName?: string;
  phone?: string;
  website?: string;
  industry?: string;
  location?: string;
  companySize?: string;
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
    const companyName = input.companyName?.trim() ?? '';
    const phone = input.phone?.trim() ?? '';
    const website = input.website?.trim() ?? '';
    const industry = input.industry?.trim() ?? '';
    const location = input.location?.trim() ?? '';
    const companySize = input.companySize?.trim() ?? '';
    const status = input.status ?? 'active';
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
      fullName: name,
      email,
      role: 'client',
      needsPasswordChange: true,
      companyName,
      phoneNumber: phone,
      website,
      industry,
      location,
      companySize,
      isOnline: false,
      lastOnlineAt: '',
      status,
      isActive: status === 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await setDoc(doc(db, 'clients', user.uid), {
      id: user.uid,
      companyName,
      website,
      industry,
      location,
      companySize,
    });

    return { id: user.uid, email, temporaryPassword };
  },

  async updateClient(id: string, updates: Partial<ClientInput>): Promise<void> {
    const { db } = requireFirebase();
    const userRef = doc(db, 'users', id);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      throw new Error('Client profile was not found.');
    }

    const existing = userSnapshot.data();
    const name = (updates.name ?? updates.fullName)?.trim();
    const email = updates.email?.trim().toLowerCase();
    const companyName = updates.companyName?.trim();
    const phone = updates.phone?.trim();
    const website = updates.website?.trim();
    const industry = updates.industry?.trim();
    const location = updates.location?.trim();
    const companySize = updates.companySize?.trim();
    const nextName = name || String(existing.fullName ?? existing.name ?? existing.full_name ?? 'Unnamed client');
    const nextEmail = email || String(existing.email ?? '');
    const nextStatus = updates.status ?? (existing.status === 'inactive' || existing.status === 'lost' ? existing.status : 'active');

    await setDoc(
      userRef,
      {
        uid: typeof existing.uid === 'string' ? existing.uid : id,
        fullName: nextName,
        email: nextEmail,
        role: 'client',
        needsPasswordChange: typeof existing.needsPasswordChange === 'boolean' ? existing.needsPasswordChange : false,
        companyName: companyName !== undefined ? companyName : String(existing.companyName ?? existing.company_name ?? ''),
        phoneNumber: phone !== undefined ? phone : String(existing.phoneNumber ?? existing.phone_number ?? ''),
        website: website !== undefined ? website : String(existing.website ?? ''),
        industry: industry !== undefined ? industry : String(existing.industry ?? ''),
        location: location !== undefined ? location : String(existing.location ?? ''),
        companySize: companySize !== undefined ? companySize : String(existing.companySize ?? existing.company_size ?? ''),
        status: nextStatus,
        isActive: nextStatus === 'active',
        createdAt: existing.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
        id: deleteField(),
        name: deleteField(),
        full_name: deleteField(),
        company_name: deleteField(),
        phone_number: deleteField(),
        company_size: deleteField(),
        is_online: deleteField(),
        last_online_at: deleteField(),
        is_active: deleteField(),
        created_at: deleteField(),
        updated_at: deleteField(),
      },
      { merge: true },
    );

    if (companyName !== undefined || website !== undefined || industry !== undefined || location !== undefined || companySize !== undefined) {
      await setDoc(doc(db, 'clients', id), {
        id,
        ...(companyName !== undefined ? { companyName } : {}),
        ...(website !== undefined ? { website } : {}),
        ...(industry !== undefined ? { industry } : {}),
        ...(location !== undefined ? { location } : {}),
        ...(companySize !== undefined ? { companySize } : {}),
      }, { merge: true });
    }
  },

  async deleteClient(id: string): Promise<void> {
    await deleteDoc(doc(requireFirebase().db, 'users', id));
  },
};
