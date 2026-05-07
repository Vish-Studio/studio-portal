/**
 * Seed data — single source of truth for all demo records.
 * Imported by src/lib/initStores.ts which hydrates Zustand stores on app start.
 * Individual data files re-export these constants for backward-compat with Storybook.
 */

import type { Client }          from './clients';
import type { AdminStats, Expense } from './admin';
import type { TeamMember, TeamProject } from './team';
import type { StudioDocument }  from './documents';
import type { Task }            from './tasks';
import type { ClientProject }   from './projects';
import { buildDefaultPhases }   from './projects';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const msAgo   = (n: number) => Date.now() - n * 86_400_000;
const msAhead = (n: number) => Date.now() + n * 86_400_000;
const dateStr = (n: number) => new Date(msAhead(n)).toISOString().slice(0, 10);

const createdAt = (daysAgo: number, hoursAgo = 0) => ({
  toMillis: () => msAgo(daysAgo) - hoursAgo * 3_600_000,
  toDate:   () => new Date(msAgo(daysAgo) - hoursAgo * 3_600_000),
});

const expenseAt = (daysAgo: number) => ({
  toMillis: () => msAgo(daysAgo),
});

// ─── Clients ──────────────────────────────────────────────────────────────────

export const DEMO_CLIENTS: Client[] = [
  { id: 'c1', displayName: 'Sarah Mitchell', companyName: 'Acme Corp',    email: 'sarah@acme.com',    phone: '+1 (555) 201-4400', role: 'client', status: 'active',   createdAt: createdAt(5)  },
  { id: 'c2', displayName: 'James Lee',      companyName: 'Globex',       email: 'james@globex.com',  phone: '+1 (555) 304-7821', role: 'client', status: 'active',   createdAt: createdAt(10) },
  { id: 'c3', displayName: 'Priya Shah',     companyName: 'Initech',      email: 'priya@initech.com', phone: '+1 (555) 102-9934', role: 'client', status: 'inactive', createdAt: createdAt(30) },
  { id: 'c4', displayName: 'Tony Nguyen',    companyName: 'Stark Ind.',   email: 'tony@stark.com',    phone: '+1 (555) 876-0012', role: 'client', status: 'lost',     createdAt: createdAt(60) },
  { id: 'c5', displayName: 'Elena Vasquez',  companyName: 'Umbrella',     email: 'elena@umbrella.com',phone: '+1 (555) 437-5519', role: 'client', status: 'active',   createdAt: createdAt(2)  },
  { id: 'c6', displayName: 'Marcus Webb',    companyName: 'Weyland Co',   email: 'm.webb@weyland.io', phone: '+44 20 7946 0321',  role: 'client', status: 'inactive', createdAt: createdAt(45) },
];

export const DEMO_RECENT_CLIENTS = [
  { id: 'r1', displayName: 'Sarah',  email: 'sarah@acme.com',    status: 'active'   },
  { id: 'r2', displayName: 'James',  email: 'james@globex.com',  status: 'active'   },
  { id: 'r3', displayName: 'Priya',  email: 'priya@initech.com', status: 'inactive' },
  { id: 'r4', displayName: 'Elena',  email: 'elena@umbrella.com',status: 'active'   },
  { id: 'r5', displayName: 'Marcus', email: 'm.webb@weyland.io', status: 'inactive' },
];

// ─── Projects (ClientProject) ─────────────────────────────────────────────────

export const DEMO_PROJECTS: ClientProject[] = [
  { id: 'p1',  clientId: 'c1', name: 'Brand Refresh',         service: 'branding',    status: 'active',    phases: buildDefaultPhases(4), agreedPayment: 8000,  paidPayment: 5000,  timeline: 'Q3 2026', startedAt: msAgo(45),  assignedMemberIds: ['m1', 'm7'] },
  { id: 'p2',  clientId: 'c1', name: 'Social Media Kit',      service: 'logo-design', status: 'active',    phases: buildDefaultPhases(1), agreedPayment: 3500,  paidPayment: 1750,  timeline: 'Q4 2026', startedAt: msAgo(10),  assignedMemberIds: ['m6'] },
  { id: 'p3',  clientId: 'c2', name: 'E-Commerce Redesign',   service: 'website',     package: 'premium',  status: 'active',    phases: buildDefaultPhases(6), agreedPayment: 12000, paidPayment: 9500,  timeline: 'Q3 2026', startedAt: msAgo(60),  assignedMemberIds: ['m2', 'm4'] },
  { id: 'p4',  clientId: 'c3', name: 'Mobile App MVP',        service: 'mobile-app',  status: 'completed', phases: buildDefaultPhases(9), agreedPayment: 15000, paidPayment: 15000, timeline: 'Q2 2026', startedAt: msAgo(120), assignedMemberIds: ['m3', 'm8'] },
  { id: 'p5',  clientId: 'c4', name: 'Marketing Site',        service: 'website',     package: 'growth',   status: 'paused',    phases: buildDefaultPhases(3), agreedPayment: 4500,  paidPayment: 2000,  timeline: 'TBD',     startedAt: msAgo(90),  assignedMemberIds: ['m8'] },
  { id: 'p6',  clientId: 'c5', name: 'Dashboard Analytics',   service: 'software',    package: 'premium',  status: 'active',    phases: buildDefaultPhases(2), agreedPayment: 6000,  paidPayment: 2000,  timeline: 'Q4 2026', startedAt: msAgo(20),  assignedMemberIds: ['m5', 'm2'] },
  { id: 'p7',  clientId: 'c6', name: 'Platform Redesign',     service: 'software',    package: 'growth',   status: 'paused',    phases: buildDefaultPhases(1), agreedPayment: 9000,  paidPayment: 3000,  timeline: 'TBD',     startedAt: msAgo(50),  assignedMemberIds: ['m4'] },
  { id: 'p8',  clientId: 'c2', name: 'iOS Companion App',     service: 'mobile-app',  status: 'active',    phases: buildDefaultPhases(3), agreedPayment: 11000, paidPayment: 4500,  timeline: 'Q1 2027', startedAt: msAgo(30),  assignedMemberIds: ['m3', 'm5'] },
  { id: 'p9',  clientId: 'c3', name: 'Brand Identity System', service: 'branding',    status: 'completed', phases: buildDefaultPhases(9), agreedPayment: 7500,  paidPayment: 7500,  timeline: 'Q1 2026', startedAt: msAgo(180), assignedMemberIds: ['m1'] },
  { id: 'p10', clientId: 'c4', name: 'SaaS Operations Tool',  service: 'software',    package: 'essentials', status: 'active',  phases: buildDefaultPhases(5), agreedPayment: 5500,  paidPayment: 3000,  timeline: 'Q4 2026', startedAt: msAgo(35),  assignedMemberIds: ['m2', 'm8'] },
  { id: 'p11', clientId: 'c5', name: 'Corporate Site',        service: 'website',     package: 'essentials', status: 'paused',  phases: buildDefaultPhases(2), agreedPayment: 3200,  paidPayment: 1000,  timeline: 'TBD',     startedAt: msAgo(75),  assignedMemberIds: ['m7'] },
  { id: 'p12', clientId: 'c6', name: 'Logo & Brand Kit',      service: 'logo-design', status: 'active',    phases: buildDefaultPhases(2), agreedPayment: 2800,  paidPayment: 1400,  timeline: 'Q3 2026', startedAt: msAgo(15),  assignedMemberIds: ['m6', 'm1'] },
];

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const DEMO_TASKS: Task[] = [
  // Brand Refresh (p1)
  { id: 'tk1',  title: 'Create brand style guide',         description: 'Define typography, colour palette, and spacing tokens.', projectId: 'p1', status: 'completed',   priority: 'high',   assigneeIds: ['m1'],       createdAt: msAgo(30), updatedAt: msAgo(10) },
  { id: 'tk2',  title: 'Design primary logo variations',   description: 'Horizontal, stacked, and icon-only lockups for all media.', projectId: 'p1', status: 'in-progress', priority: 'high',   assigneeIds: ['m1','m7'], dueDate: dateStr(8),  createdAt: msAgo(20), updatedAt: msAgo(1) },
  { id: 'tk3',  title: 'Finalise colour palette',                                                                                   projectId: 'p1', status: 'to-test',    priority: 'medium', assigneeIds: ['m7'],       clientAssigneeId: 'c1', dueDate: dateStr(12), createdAt: msAgo(18), updatedAt: msAgo(2) },
  { id: 'tk4',  title: 'Brand guidelines document',                                                                                  projectId: 'p1', status: 'todo',       priority: 'medium',                           clientAssigneeId: 'c1', createdAt: msAgo(15), updatedAt: msAgo(15) },
  // E-Commerce Redesign (p3)
  { id: 'tk5',  title: 'Homepage wireframes',              description: 'Above-the-fold hero, feature blocks, and footer sections.', projectId: 'p3', status: 'completed',   priority: 'high',   assigneeIds: ['m2'],       createdAt: msAgo(45), updatedAt: msAgo(20) },
  { id: 'tk6',  title: 'Product listing page',             description: 'Grid layout with filter sidebar and sort controls.',        projectId: 'p3', status: 'completed',   priority: 'high',   assigneeIds: ['m2','m4'], createdAt: msAgo(40), updatedAt: msAgo(14) },
  { id: 'tk7',  title: 'Checkout flow implementation',     description: 'Multi-step checkout: cart → address → payment → confirmation.', projectId: 'p3', status: 'in-progress', priority: 'high',   assigneeIds: ['m4'],       dueDate: dateStr(5),  createdAt: msAgo(25), updatedAt: msAgo(1) },
  { id: 'tk8',  title: 'Payment gateway integration',                                                                                projectId: 'p3', status: 'todo',       priority: 'high',   assigneeIds: ['m4'],       dueDate: dateStr(15), createdAt: msAgo(25), updatedAt: msAgo(25) },
  { id: 'tk9',  title: 'Cross-browser & mobile QA',                                                                                  projectId: 'p3', status: 'to-test',    priority: 'medium',                           dueDate: dateStr(18), createdAt: msAgo(10), updatedAt: msAgo(3) },
  // Dashboard Analytics (p6)
  { id: 'tk10', title: 'Data schema design',               description: 'Define PostgreSQL tables and relationships for analytics events.', projectId: 'p6', status: 'completed',   priority: 'high',   assigneeIds: ['m5'],       createdAt: msAgo(22), updatedAt: msAgo(8) },
  { id: 'tk11', title: 'REST API endpoints',               description: 'Build aggregation endpoints with pagination and caching.',         projectId: 'p6', status: 'in-progress', priority: 'high',   assigneeIds: ['m2','m5'], dueDate: dateStr(6),  createdAt: msAgo(18), updatedAt: msAgo(1) },
  { id: 'tk12', title: 'Chart components (line, bar, donut)',                                                                         projectId: 'p6', status: 'todo',       priority: 'medium', assigneeIds: ['m2'],       createdAt: msAgo(12), updatedAt: msAgo(12) },
  { id: 'tk13', title: 'Performance benchmarking',                                                                                    projectId: 'p6', status: 'to-test',    priority: 'medium',                           dueDate: dateStr(20), createdAt: msAgo(8),  updatedAt: msAgo(2) },
  // iOS Companion App (p8)
  { id: 'tk14', title: 'App architecture setup',           description: 'Establish folder structure, routing, and state management.',       projectId: 'p8', status: 'completed',   priority: 'high',   assigneeIds: ['m3'],       createdAt: msAgo(32), updatedAt: msAgo(18) },
  { id: 'tk15', title: 'Navigation & tab bar',                                                                                        projectId: 'p8', status: 'in-progress', priority: 'medium', assigneeIds: ['m3','m5'], dueDate: dateStr(10), createdAt: msAgo(20), updatedAt: msAgo(1) },
  { id: 'tk16', title: 'Push notification integration',                                                                               projectId: 'p8', status: 'todo',       priority: 'low',    assigneeIds: ['m3'],       createdAt: msAgo(14), updatedAt: msAgo(14) },
  // SaaS Operations Tool (p10)
  { id: 'tk17', title: 'User authentication (OAuth2)',     description: 'Google and GitHub SSO with JWT session tokens.',                  projectId: 'p10', status: 'completed',   priority: 'high',   assigneeIds: ['m2','m8'], createdAt: msAgo(28), updatedAt: msAgo(9) },
  { id: 'tk18', title: 'Role-based permissions',                                                                                      projectId: 'p10', status: 'to-test',    priority: 'high',   assigneeIds: ['m8'],       dueDate: dateStr(4),  createdAt: msAgo(16), updatedAt: msAgo(1) },
  { id: 'tk19', title: 'Audit logging system',                                                                                        projectId: 'p10', status: 'todo',       priority: 'low',                              createdAt: msAgo(10), updatedAt: msAgo(10) },
  { id: 'tk20', title: 'Onboarding email sequences',                                                                                  projectId: 'p10', status: 'todo',       priority: 'medium', assigneeIds: ['m5'],       createdAt: msAgo(8),  updatedAt: msAgo(8) },
];

// ─── Team members ─────────────────────────────────────────────────────────────

export const DEMO_MEMBERS: TeamMember[] = [
  { id: 'm1', name: 'Aisha Patel',    role: 'Lead Designer',       email: 'aisha@studio.com',  assignedProjectId: 'p1' },
  { id: 'm2', name: 'Jordan Clarke',  role: 'Frontend Developer',  email: 'jordan@studio.com', assignedProjectId: 'p2' },
  { id: 'm3', name: 'Mei Lin',        role: 'UX Researcher',       email: 'mei@studio.com',    assignedProjectId: 'p3' },
  { id: 'm4', name: 'Samuel Osei',    role: 'Full-Stack Developer',email: 'samuel@studio.com', assignedProjectId: 'p2' },
  { id: 'm5', name: 'Priya Nair',     role: 'Project Manager',     email: 'priya@studio.com',  assignedProjectId: 'p5' },
  { id: 'm6', name: 'Tom Eriksen',    role: 'Motion Designer',     email: 'tom@studio.com',    assignedProjectId: null },
  { id: 'm7', name: 'Lucia Romero',   role: 'Brand Strategist',    email: 'lucia@studio.com',  assignedProjectId: 'p1' },
  { id: 'm8', name: 'Dev Sharma',     role: 'Backend Developer',   email: 'dev@studio.com',    assignedProjectId: 'p4' },
];

export const DEMO_TEAM_PROJECTS: TeamProject[] = [
  { id: 'p1', name: 'Brand Refresh',       client: 'Acme Corp',       status: 'active',    createdAt: msAgo(1) - 9 * 3_600_000  },
  { id: 'p2', name: 'E-Commerce Redesign', client: 'Globex',          status: 'active',    createdAt: msAgo(3) - 14 * 3_600_000 },
  { id: 'p3', name: 'Mobile App MVP',      client: 'Initech',         status: 'active',    createdAt: msAgo(5) - 11 * 3_600_000 },
  { id: 'p4', name: 'Marketing Site',      client: 'Stark Industries', status: 'paused',   createdAt: msAgo(8) - 16 * 3_600_000 },
  { id: 'p5', name: 'Dashboard Analytics', client: 'Umbrella Ltd',    status: 'active',    createdAt: msAgo(12) - 10 * 3_600_000 },
];

// ─── Documents ────────────────────────────────────────────────────────────────

export const DEMO_DOCUMENTS: StudioDocument[] = [
  { id: 'd1', type: 'contract',  title: 'Service Agreement',      url: '#', clientId: 'c1', createdAt: { toMillis: () => msAgo(1) - 2 * 3_600_000 }, author: { type: 'client', name: 'Acme Corp' } },
  { id: 'd2', type: 'proposal',  title: 'Project Proposal 2026',  url: '#', clientId: 'c1', createdAt: { toMillis: () => msAgo(5) - 5 * 3_600_000 }, author: { type: 'member', name: 'Aisha Patel' } },
  { id: 'd3', type: 'invoice',   title: 'Initial Deposit Invoice', url: '#', clientId: 'c1', createdAt: { toMillis: () => msAgo(10) - 1 * 3_600_000 }, author: { type: 'member', name: 'Priya Nair' } },
];

// ─── Admin stats & expenses ───────────────────────────────────────────────────

export const DEMO_STATS: AdminStats = {
  totalClients:  1293,
  activeProjects: 857,
  totalRevenue:  256000,
  totalExpenses: 8400,
};

export const DEMO_EXPENSES: Expense[] = [
  { id: 'e1', amount: 3250, description: 'Crypter - NFT UI Kit',           createdAt: expenseAt(1) },
  { id: 'e2', amount: 7890, description: 'Bento Pro 2.0 Illustrations',    createdAt: expenseAt(2) },
  { id: 'e3', amount: 1500, description: 'Fleet - travel shopping kit',    createdAt: expenseAt(5) },
  { id: 'e4', amount: 9999, description: 'SimpleSocial UI Design Kit',     createdAt: expenseAt(10) },
];
