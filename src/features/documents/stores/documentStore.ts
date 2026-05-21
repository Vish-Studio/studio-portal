import { create } from 'zustand';
export type { StudioDocument, DocumentType } from '../types';
import type { StudioDocument } from '../types';
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { requireFirebase } from '@/src/firebase/requireFirebase';
import { documentDocToStudioDocument } from '@/src/firebase/firestoreTransformers';

interface DocumentsState {
  documents: StudioDocument[];
  loading: { docs: boolean };
  error: { docs: string | null };
  setDocuments:  (docs: StudioDocument[]) => void;
  subscribeToDocuments: (projectId?: string) => Unsubscribe;
  signDocument:  (docId: string, signatureName: string, uid?: string) => Promise<void>;
}

export const useDocumentsStore = create<DocumentsState>((set) => ({
  documents: [],
  loading: { docs: false },
  error: { docs: null },

  setDocuments: (documents) => set({ documents }),

  subscribeToDocuments: (projectId) => {
    set({ loading: { docs: true }, error: { docs: null } });
    const base = collection(requireFirebase().db, 'documents');
    const ref = projectId ? query(base, where('projectId', '==', projectId)) : base;
    return onSnapshot(
      ref,
      snapshot => set({ documents: snapshot.docs.map(documentDocToStudioDocument), loading: { docs: false }, error: { docs: null } }),
      error => set({ loading: { docs: false }, error: { docs: error.message } }),
    );
  },

  signDocument: async (docId, signatureName, uid) => {
    await updateDoc(doc(requireFirebase().db, 'documents', docId), {
      actionStatus: 'approved',
      clientNotes: signatureName,
      uploadedBy: uid,
      updatedAt: serverTimestamp(),
    });
  },
}));
