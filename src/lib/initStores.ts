/**
 * Hydrates all Zustand stores with seed data before the React tree mounts.
 * Called synchronously in main.tsx so stores are populated on first render.
 */
import {
  DEMO_PROJECTS,
  DEMO_TASKS,
  DEMO_CLIENTS,
  DEMO_RECENT_CLIENTS,
  DEMO_MEMBERS,
  DEMO_TEAM_PROJECTS,
  DEMO_DOCUMENTS,
  DEMO_STATS,
  DEMO_EXPENSES,
} from '../data/seed';

import { useProjectsStore }  from '../store/projects';
import { useTasksStore }     from '../store/tasks';
import { useClientsStore }   from '../store/clients';
import { useTeamStore }      from '../store/team';
import { useDocumentsStore } from '../store/documents';
import { useAdminStore }     from '../store/admin';

export function initStores(): void {
  useProjectsStore.getState().setProjects(DEMO_PROJECTS);
  useTasksStore.getState().setTasks(DEMO_TASKS);
  useClientsStore.getState().setClients(DEMO_CLIENTS);
  useTeamStore.getState().setMembers(DEMO_MEMBERS);
  useTeamStore.getState().setProjects(DEMO_TEAM_PROJECTS);
  useDocumentsStore.getState().setDocuments(DEMO_DOCUMENTS);
  useAdminStore.getState().setStats(DEMO_STATS);
  useAdminStore.getState().setRecentClients(DEMO_RECENT_CLIENTS);
  useAdminStore.getState().setExpenses(DEMO_EXPENSES);
}
