import { create } from "zustand";
import { DEMO_DOCUMENTS } from "../data/documents";
export type { StudioDocument, DocumentType } from "../data/documents";

import type { StudioDocument } from "../data/documents";

interface DocumentsState {
  documents: StudioDocument[];
  setDocuments: (docs: StudioDocument[]) => void;
  signDocument: (docId: string, signatureName: string, uid?: string) => void;
}

export const useDocumentsStore = create<DocumentsState>((set) => ({
  documents: DEMO_DOCUMENTS,

  setDocuments: (documents) => set({ documents }),

  signDocument: (docId, signatureName, uid) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === docId
          ? {
              ...d,
              isSigned: true,
              signatureData: {
                name: signatureName,
                uid,
                timestamp: new Date().toISOString(),
              },
            }
          : d,
      ),
    })),
}));
