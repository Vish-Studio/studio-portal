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

// Demo data lives in seed.ts — re-exported here for Storybook compatibility
export { DEMO_TASKS } from './seed';
