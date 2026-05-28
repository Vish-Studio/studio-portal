import { useEffect } from 'react';
import { useAuthStore } from '@/src/features/auth';
import { useProjectsStore } from '@/src/features/projects';
import { useTasksStore } from '@/src/features/tasks';
import { useDocumentsStore } from '@/src/features/documents';
import { useClientsStore } from '@/src/features/clients';
import { useTeamStore } from '@/src/features/team';
import { useExpenseStore } from '@/src/features/expenses';
import { useCalendarStore } from '@/src/features/calendar';
import { isStaffRole } from '@/src/auth/roleAccess';

export function FirestoreStreams() {
  const profile = useAuthStore(state => state.profile);
  const subscribeToProjects = useProjectsStore(state => state.subscribeToProjects);
  const subscribeToTasks = useTasksStore(state => state.subscribeToTasks);
  const subscribeToDocuments = useDocumentsStore(state => state.subscribeToDocuments);
  const subscribeClients = useClientsStore(state => state.subscribeClients);
  const setClients = useClientsStore(state => state.setClients);
  const subscribeMembers = useTeamStore(state => state.subscribeMembers);
  const subscribeToExpenses = useExpenseStore(state => state.subscribeToExpenses);
  const subscribeToCalendarEvents = useCalendarStore(state => state.subscribeToEvents);
  const clearCalendarEvents = useCalendarStore(state => state.clearEvents);

  useEffect(() => {
    if (!profile) return undefined;

    const unsubscribers = [
      subscribeToProjects(
        profile.role === 'client'
          ? { clientId: profile.uid }
          : profile.role === 'team' || profile.role === 'freelancer'
            ? { teamId: profile.uid }
            : undefined,
      ),
      subscribeToTasks(
        profile.role === 'client'
          ? { clientId: profile.uid }
          : profile.role === 'team' || profile.role === 'freelancer'
            ? { assigneeId: profile.uid }
            : undefined,
      ),
      subscribeToDocuments(),
      subscribeToCalendarEvents(profile),
    ];

    if (isStaffRole(profile.role)) {
      unsubscribers.push(subscribeClients());
      unsubscribers.push(subscribeMembers());
      unsubscribers.push(subscribeToExpenses());
    } else {
      setClients([{
        id: profile.uid,
        userId: profile.uid,
        fullName: profile.fullName,
        email: profile.email,
        companyName: profile.companyName ?? '',
        phone: profile.phoneNumber ?? '',
        role: 'client',
        status: profile.status === 'inactive' || profile.status === 'lost' ? profile.status : 'active',
        createdAt: profile.createdAt,
      }]);
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
      clearCalendarEvents();
    };
  }, [clearCalendarEvents, profile, setClients, subscribeClients, subscribeMembers, subscribeToCalendarEvents, subscribeToDocuments, subscribeToExpenses, subscribeToProjects, subscribeToTasks]);

  return null;
}
