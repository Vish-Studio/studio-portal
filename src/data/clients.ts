export interface Client {
  id: string;
  displayName: string;
  email: string;
  role: "client";
  status: "active" | "agreed" | "prospect" | "lost";
  createdAt: { toMillis: () => number; toDate: () => Date };
}

const daysAgo = (n: number) => ({
  toMillis: () => Date.now() - 86400000 * n,
  toDate: () => new Date(Date.now() - 86400000 * n),
});

export const DEMO_CLIENTS: Client[] = [
  { id: "c1", displayName: "Acme Corp", email: "hello@acme.com", role: "client", status: "active", createdAt: daysAgo(5) },
  { id: "c2", displayName: "Globex", email: "ceo@globex.com", role: "client", status: "agreed", createdAt: daysAgo(10) },
  { id: "c3", displayName: "Initech", email: "contact@initech.com", role: "client", status: "prospect", createdAt: daysAgo(15) },
  { id: "c4", displayName: "Stark Industries", email: "tony@stark.com", role: "client", status: "lost", createdAt: daysAgo(30) },
  { id: "c5", displayName: "Umbrella Ltd", email: "info@umbrella.com", role: "client", status: "active", createdAt: daysAgo(2) },
];

export const DEMO_RECENT_CLIENTS = [
  { id: "r1", displayName: "Gladys", email: "hello@acme.com", status: "active" },
  { id: "r2", displayName: "Elbert", email: "ceo@globex.com", status: "agreed" },
  { id: "r3", displayName: "Dash", email: "contact@initech.com", status: "prospect" },
  { id: "r4", displayName: "Joyce", email: "foo@bar.com", status: "active" },
  { id: "r5", displayName: "Marina", email: "baz@qux.com", status: "active" },
];
