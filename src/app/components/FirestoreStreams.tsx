import { useEffect } from 'react';
import { useAuthStore } from '@/src/features/auth';
import { useProjectsStore } from '@/src/features/projects';
import { useTasksStore } from '@/src/features/tasks';
import { useDocumentsStore } from '@/src/features/documents';
import { useClientsStore } from '@/src/features/clients';
import { useTeamStore } from '@/src/features/team';
import { useExpenseStore } from '@/src/features/expenses';
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
      subscribeToTasks(),
      subscribeToDocuments(),
    ];

    if (isStaffRole(profile.role)) {
      unsubscribers.push(subscribeClients());
      unsubscribers.push(subscribeMembers());
      unsubscribers.push(subscribeToExpenses());
    } else {
      setClients([{
        id: profile.uid,
        userId: profile.uid,
        user_id: profile.uid,
        fullName: profile.full_name ?? profile.fullName,
        full_name: profile.full_name ?? profile.fullName,
        email: profile.email,
        companyName: profile.company_name ?? '',
        company_name: profile.company_name ?? '',
        phone: profile.phone_number ?? '',
        phone_number: profile.phone_number ?? '',
        role: 'client',
        status: profile.status === 'inactive' || profile.status === 'lost' ? profile.status : 'active',
        createdAt: profile.createdAt,
        created_at: profile.created_at,
      }]);
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [profile, setClients, subscribeClients, subscribeMembers, subscribeToDocuments, subscribeToExpenses, subscribeToProjects, subscribeToTasks]);

  return null;
}
