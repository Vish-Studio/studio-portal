import { UserCalendarPage } from '@/src/features/calendar';
import { UserChatPage } from '@/src/features/chat';
import { UserDashboardPage } from '@/src/features/dashboard';
import { UserDocumentsPage } from '@/src/features/documents';
import { UserPaymentsPage } from '@/src/features/payments';
import { UserProjectsPage } from '@/src/features/projects';
import { UserSettingsPage } from '@/src/features/settings';
import { UserTasksPage } from '@/src/features/tasks';
import type { AppRouteDefinition } from './types';

export const userRoutes: AppRouteDefinition[] = [
  { path: '/user', element: <UserDashboardPage /> },
  { path: '/user/projects', element: <UserProjectsPage /> },
  { path: '/user/calendar', element: <UserCalendarPage /> },
  { path: '/user/tasks', element: <UserTasksPage /> },
  { path: '/user/payments', element: <UserPaymentsPage /> },
  { path: '/user/documents', element: <UserDocumentsPage /> },
  { path: '/user/chat', element: <UserChatPage /> },
  { path: '/user/settings', element: <UserSettingsPage /> },
];
