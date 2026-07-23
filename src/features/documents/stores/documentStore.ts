import { create } from 'zustand';
export type { StudioDocument, DocumentType } from '../types';
import type { StudioDocument } from '../types';

interface DocumentsState {
  documents: StudioDocument[];
  loading: { docs: boolean };
  error: { docs: string | null };
  setDocuments: (docs: StudioDocument[]) => void;
  subscribeToDocuments: (projectId?: string) => () => void;
  signDocument: (docId: string, signatureName: string, uid?: string) => Promise<void>;
}

export const useDocumentsStore = create<DocumentsState>((set) => ({
  documents: [],
  loading: { docs: false },
  error: { docs: null },

  setDocuments: (documents) => set({ documents }),

  subscribeToDocuments: () => {
    set({ loading: { docs: false }, error: { docs: null } });
    return () => undefined;
  },

  signDocument: async (docId, signatureName, uid) => {
    set(state => ({
      documents: state.documents.map(document => (
        document.id === docId
          ? {
              ...document,
              isSigned: true,
              signatureData: {
                name: signatureName,
                uid,
                timestamp: new Date().toISOString(),
              },
            }
          : document
      )),
    }));
  },
}));
