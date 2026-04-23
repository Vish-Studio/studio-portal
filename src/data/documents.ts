export type DocumentType = "contract" | "proposal" | "invoice" | "quotation" | "onboarding";

export interface DocumentAuthor {
  type: "client" | "member";
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

const daysAgo = (n: number, h = 0) => ({
  toMillis: () => Date.now() - n * 86400000 - h * 3600000,
});

export const DEMO_DOCUMENTS: StudioDocument[] = [
  {
    id: "d1",
    type: "contract",
    title: "Service Agreement",
    url: "#",
    createdAt: daysAgo(1, 2),
    author: { type: "client", name: "Acme Corp" },
  },
  {
    id: "d2",
    type: "proposal",
    title: "Project Proposal 2026",
    url: "#",
    createdAt: daysAgo(5, 5),
    author: { type: "member", name: "Aisha Patel" },
  },
  {
    id: "d3",
    type: "invoice",
    title: "Initial Deposit Invoice",
    url: "#",
    createdAt: daysAgo(10, 1),
    author: { type: "member", name: "Priya Nair" },
  },
];
