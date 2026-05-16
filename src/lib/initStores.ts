/**
 * Hydrates non-Firebase Zustand stores with local demo data before the React tree mounts.
 * Firebase-backed stores such as clients and team subscribe from their pages/components.
 */
import {
  DEMO_PROJECTS,
  DEMO_TASKS,
  DEMO_RECENT_CLIENTS,
  DEMO_TEAM_PROJECTS,
  DEMO_DOCUMENTS,
  DEMO_STATS,
  DEMO_EXPENSES,
} from '../data/seed';

import { useProjectsStore }  from '../store/projects';
import { useTasksStore }     from '../store/tasks';
import { useTeamStore }      from '../store/team';
import { useDocumentsStore } from '../store/documents';
import { useAdminStore }     from '../store/admin';

export function initStores(): void {
  useProjectsStore.getState().setProjects(DEMO_PROJECTS);
  useTasksStore.getState().setTasks(DEMO_TASKS);
  useTeamStore.getState().setProjects(DEMO_TEAM_PROJECTS);
  useDocumentsStore.getState().setDocuments(DEMO_DOCUMENTS);
  useAdminStore.getState().setStats(DEMO_STATS);
  useAdminStore.getState().setRecentClients(DEMO_RECENT_CLIENTS);
  useAdminStore.getState().setExpenses(DEMO_EXPENSES);
}
