export type DocumentType = "contract" | "proposal" | "invoice" | "quotation" | "onboarding";

export interface StudioDocument {
  id: string;
  type: DocumentType;
  title: string;
  url: string;
  clientId?: string;
  isSigned?: boolean;
  signatureData?: { name: string; uid?: string; timestamp?: string };
  createdAt: { toMillis: () => number };
}

const daysAgo = (n: number) => ({ toMillis: () => Date.now() - 86400000 * n });

export const DEMO_DOCUMENTS: StudioDocument[] = [
  { id: "d1", type: "contract", title: "Service Agreement", url: "#", createdAt: daysAgo(1) },
  { id: "d2", type: "proposal", title: "Project Proposal 2026", url: "#", createdAt: daysAgo(5) },
  { id: "d3", type: "invoice", title: "Initial Deposit Invoice", url: "#", createdAt: daysAgo(10) },
];
