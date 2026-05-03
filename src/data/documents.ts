export type DocumentType = 'contract' | 'proposal' | 'invoice' | 'quotation' | 'onboarding';

export interface DocumentAuthor {
  type: 'client' | 'member';
  name: string;
}

export interface StudioDocument {
  id: string;
  type: DocumentType;
  title: string;
  url: string;
  clientId?: string;
  isSigned?: boolean;
  signatureData?: { name: string; uid?: string; timestamp?: string };
  createdAt: { toMillis: () => number };
  author?: DocumentAuthor;
}

// Demo data lives in seed.ts — re-exported here for Storybook compatibility
export { DEMO_DOCUMENTS } from './seed';
