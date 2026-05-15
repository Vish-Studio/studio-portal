import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { requireFirebase } from './firebase-service';
import type { StaffRole } from '@/src/types/auth';

export interface SignInAccessRecord {
  email: string;
  profileRole: StaffRole | 'user';
  staffRole?: StaffRole;
  teamMemberId?: string;
  teamId?: string;
  clientId?: string;
  displayName: string;
  status: 'active' | 'inactive';
}

export const normalizeAccessEmail = (email: string) => email.trim().toLowerCase();

const accessDoc = (email: string) =>
  doc(requireFirebase().db, 'signInAccess', normalizeAccessEmail(email));

export const accessService = {
  async getAccess(email: string): Promise<SignInAccessRecord | null> {
    const snapshot = await getDoc(accessDoc(email));
    if (!snapshot.exists()) return null;
    return snapshot.data() as SignInAccessRecord;
  },

  async upsertAccess(record: SignInAccessRecord) {
    await setDoc(accessDoc(record.email), {
      ...record,
      email: normalizeAccessEmail(record.email),
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    }, { merge: true });
  },

  async removeAccess(email: string) {
    await deleteDoc(accessDoc(email));
  },
};
