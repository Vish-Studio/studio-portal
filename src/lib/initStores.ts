import {
  DEMO_CLIENTS,
  DEMO_DOCUMENTS,
  DEMO_EXPENSES,
  DEMO_MEMBERS,
  DEMO_PROJECTS,
  DEMO_RECENT_CLIENTS,
  DEMO_STATS,
  DEMO_TASKS,
  DEMO_TEAM_PROJECTS,
} from '@/src/data/seed';
import { useClientsStore } from '@/src/features/clients';
import { useDocumentsStore } from '@/src/features/documents';
import { useExpenseStore } from '@/src/features/expenses';
import { useProjectsStore } from '@/src/features/projects';
import { useTasksStore } from '@/src/features/tasks';
import { useTeamStore } from '@/src/features/team';

/** Bootstraps local demo data into Zustand stores before React mounts. */
export function initStores(): void {
  useClientsStore.getState().setClients(DEMO_CLIENTS);
  useProjectsStore.getState().setProjects(DEMO_PROJECTS);
  useTasksStore.getState().setTasks(DEMO_TASKS);
  useDocumentsStore.getState().setDocuments(DEMO_DOCUMENTS);
  useExpenseStore.getState().setStats(DEMO_STATS);
  useExpenseStore.getState().setRecentClients(DEMO_RECENT_CLIENTS);
  useExpenseStore.getState().setExpenses(DEMO_EXPENSES);
  useTeamStore.getState().setMembers(DEMO_MEMBERS);
  useTeamStore.getState().setProjects(DEMO_TEAM_PROJECTS);
}
