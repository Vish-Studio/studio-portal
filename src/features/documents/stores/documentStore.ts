import { create } from 'zustand';
export type { StudioDocument, DocumentType } from '../types';
import type { StudioDocument } from '../types';

interface DocumentsState {
  documents: StudioDocument[];
  setDocuments:  (docs: StudioDocument[]) => void;
  signDocument:  (docId: string, signatureName: string, uid?: string) => void;
}

export const useDocumentsStore = create<DocumentsState>((set) => ({
  documents: [], // hydrated on app start via initStores()

  setDocuments: (documents) => set({ documents }),

  signDocument: (docId, signatureName, uid) =>
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === docId
          ? { ...d, isSigned: true, signatureData: { name: signatureName, uid, timestamp: new Date().toISOString() } }
          : d,
      ),
    })),
}));
