export type ClientStatus = "active" | "inactive" | "lost";

export interface Client {
  id: string;
  displayName: string;
  companyName?: string;
  email: string;
  phone?: string;
  role: "client";
  status: ClientStatus;
  createdAt: { toMillis: () => number; toDate: () => Date };
}

const daysAgo = (n: number) => ({
  toMillis: () => Date.now() - 86400000 * n,
  toDate: () => new Date(Date.now() - 86400000 * n),
});

export const DEMO_CLIENTS: Client[] = [
  { id: "c1", displayName: "Sarah Mitchell", companyName: "Acme Corp", email: "sarah@acme.com",   phone: "+1 (555) 201-4400", role: "client", status: "active",   createdAt: daysAgo(5)  },
  { id: "c2", displayName: "James Lee",      companyName: "Globex",    email: "james@globex.com", phone: "+1 (555) 304-7821", role: "client", status: "active",   createdAt: daysAgo(10) },
  { id: "c3", displayName: "Priya Shah",     companyName: "Initech",   email: "priya@initech.com",phone: "+1 (555) 102-9934", role: "client", status: "inactive", createdAt: daysAgo(30) },
  { id: "c4", displayName: "Tony Nguyen",    companyName: "Stark Ind.", email: "tony@stark.com",  phone: "+1 (555) 876-0012", role: "client", status: "lost",     createdAt: daysAgo(60) },
  { id: "c5", displayName: "Elena Vasquez",  companyName: "Umbrella",  email: "elena@umbrella.com",phone: "+1 (555) 437-5519", role: "client", status: "active",   createdAt: daysAgo(2)  },
  { id: "c6", displayName: "Marcus Webb",    companyName: "Weyland Co",email: "m.webb@weyland.io",phone: "+44 20 7946 0321",   role: "client", status: "inactive", createdAt: daysAgo(45) },
];

export const DEMO_RECENT_CLIENTS = [
  { id: "r1", displayName: "Sarah", email: "sarah@acme.com",   status: "active"   },
  { id: "r2", displayName: "James", email: "james@globex.com", status: "active"   },
  { id: "r3", displayName: "Priya", email: "priya@initech.com",status: "inactive" },
  { id: "r4", displayName: "Elena", email: "elena@umbrella.com",status: "active"  },
  { id: "r5", displayName: "Marcus",email: "m.webb@weyland.io", status: "inactive"},
];
