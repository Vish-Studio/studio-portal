import type { TaskStatus } from '../components/common/status-badge/status-badge';
export type { TaskStatus };

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeIds?: string[];
  dueDate?: string; // 'YYYY-MM-DD'
  createdAt: number;
  updatedAt: number;
}

const daysAgo  = (n: number) => Date.now() - n * 86_400_000;
const daysAhead = (n: number) => Date.now() + n * 86_400_000;
const dateStr  = (n: number) => new Date(daysAhead(n)).toISOString().slice(0, 10);

export const DEMO_TASKS: Task[] = [
  // ── Brand Refresh (p1 · branding) ──────────────────────────────────────────
  {
    id: 'tk1', title: 'Create brand style guide',
    description: 'Define typography, colour palette, and spacing tokens.',
    projectId: 'p1', status: 'completed', priority: 'high',
    assigneeIds: ['m1'],
    createdAt: daysAgo(30), updatedAt: daysAgo(10),
  },
  {
    id: 'tk2', title: 'Design primary logo variations',
    description: 'Horizontal, stacked, and icon-only lockups for all media.',
    projectId: 'p1', status: 'in-progress', priority: 'high',
    assigneeIds: ['m1', 'm7'], dueDate: dateStr(8),
    createdAt: daysAgo(20), updatedAt: daysAgo(1),
  },
  {
    id: 'tk3', title: 'Finalize colour palette',
    projectId: 'p1', status: 'to-test', priority: 'medium',
    assigneeIds: ['m7'], dueDate: dateStr(12),
    createdAt: daysAgo(18), updatedAt: daysAgo(2),
  },
  {
    id: 'tk4', title: 'Brand guidelines document',
    projectId: 'p1', status: 'todo', priority: 'medium',
    createdAt: daysAgo(15), updatedAt: daysAgo(15),
  },

  // ── E-Commerce Redesign (p3 · website premium) ─────────────────────────────
  {
    id: 'tk5', title: 'Homepage wireframes',
    description: 'Above-the-fold hero, feature blocks, and footer sections.',
    projectId: 'p3', status: 'completed', priority: 'high',
    assigneeIds: ['m2'],
    createdAt: daysAgo(45), updatedAt: daysAgo(20),
  },
  {
    id: 'tk6', title: 'Product listing page',
    description: 'Grid layout with filter sidebar and sort controls.',
    projectId: 'p3', status: 'completed', priority: 'high',
    assigneeIds: ['m2', 'm4'],
    createdAt: daysAgo(40), updatedAt: daysAgo(14),
  },
  {
    id: 'tk7', title: 'Checkout flow implementation',
    description: 'Multi-step checkout: cart → address → payment → confirmation.',
    projectId: 'p3', status: 'in-progress', priority: 'high',
    assigneeIds: ['m4'], dueDate: dateStr(5),
    createdAt: daysAgo(25), updatedAt: daysAgo(1),
  },
  {
    id: 'tk8', title: 'Payment gateway integration',
    projectId: 'p3', status: 'todo', priority: 'high',
    assigneeIds: ['m4'], dueDate: dateStr(15),
    createdAt: daysAgo(25), updatedAt: daysAgo(25),
  },
  {
    id: 'tk9', title: 'Cross-browser & mobile QA',
    projectId: 'p3', status: 'to-test', priority: 'medium',
    dueDate: dateStr(18),
    createdAt: daysAgo(10), updatedAt: daysAgo(3),
  },

  // ── Dashboard Analytics (p6 · software premium) ────────────────────────────
  {
    id: 'tk10', title: 'Data schema design',
    description: 'Define PostgreSQL tables and relationships for analytics events.',
    projectId: 'p6', status: 'completed', priority: 'high',
    assigneeIds: ['m5'],
    createdAt: daysAgo(22), updatedAt: daysAgo(8),
  },
  {
    id: 'tk11', title: 'REST API endpoints',
    description: 'Build aggregation endpoints with pagination and caching.',
    projectId: 'p6', status: 'in-progress', priority: 'high',
    assigneeIds: ['m2', 'm5'], dueDate: dateStr(6),
    createdAt: daysAgo(18), updatedAt: daysAgo(1),
  },
  {
    id: 'tk12', title: 'Chart components (line, bar, donut)',
    projectId: 'p6', status: 'todo', priority: 'medium',
    assigneeIds: ['m2'],
    createdAt: daysAgo(12), updatedAt: daysAgo(12),
  },
  {
    id: 'tk13', title: 'Performance benchmarking',
    projectId: 'p6', status: 'to-test', priority: 'medium',
    dueDate: dateStr(20),
    createdAt: daysAgo(8), updatedAt: daysAgo(2),
  },

  // ── iOS Companion App (p8 · mobile-app) ────────────────────────────────────
  {
    id: 'tk14', title: 'App architecture setup',
    description: 'Establish folder structure, routing, and state management.',
    projectId: 'p8', status: 'completed', priority: 'high',
    assigneeIds: ['m3'],
    createdAt: daysAgo(32), updatedAt: daysAgo(18),
  },
  {
    id: 'tk15', title: 'Navigation & tab bar',
    projectId: 'p8', status: 'in-progress', priority: 'medium',
    assigneeIds: ['m3', 'm5'], dueDate: dateStr(10),
    createdAt: daysAgo(20), updatedAt: daysAgo(1),
  },
  {
    id: 'tk16', title: 'Push notification integration',
    projectId: 'p8', status: 'todo', priority: 'low',
    assigneeIds: ['m3'],
    createdAt: daysAgo(14), updatedAt: daysAgo(14),
  },

  // ── SaaS Operations Tool (p10 · software essentials) ──────────────────────
  {
    id: 'tk17', title: 'User authentication (OAuth2)',
    description: 'Google and GitHub SSO with JWT session tokens.',
    projectId: 'p10', status: 'completed', priority: 'high',
    assigneeIds: ['m2', 'm8'],
    createdAt: daysAgo(28), updatedAt: daysAgo(9),
  },
  {
    id: 'tk18', title: 'Role-based permissions',
    projectId: 'p10', status: 'to-test', priority: 'high',
    assigneeIds: ['m8'], dueDate: dateStr(4),
    createdAt: daysAgo(16), updatedAt: daysAgo(1),
  },
  {
    id: 'tk19', title: 'Audit logging system',
    projectId: 'p10', status: 'todo', priority: 'low',
    createdAt: daysAgo(10), updatedAt: daysAgo(10),
  },
  {
    id: 'tk20', title: 'Onboarding email sequences',
    projectId: 'p10', status: 'todo', priority: 'medium',
    assigneeIds: ['m5'],
    createdAt: daysAgo(8), updatedAt: daysAgo(8),
  },
];
