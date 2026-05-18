import type { TaskStatus } from '@/src/shared/components';
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
  clientAssigneeId?: string;
  dueDate?: string; // 'YYYY-MM-DD'
  createdAt: number;
  updatedAt: number;
}
