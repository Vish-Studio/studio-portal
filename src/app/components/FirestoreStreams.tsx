import { useEffect } from 'react';
import { useAuthStore } from '@/src/features/auth';
import { useProjectsStore } from '@/src/features/projects';
import { useTasksStore } from '@/src/features/tasks';
import { useDocumentsStore } from '@/src/features/documents';

export function FirestoreStreams() {
  const profile = useAuthStore(state => state.profile);
  const subscribeToProjects = useProjectsStore(state => state.subscribeToProjects);
  const subscribeToTasks = useTasksStore(state => state.subscribeToTasks);
  const subscribeToDocuments = useDocumentsStore(state => state.subscribeToDocuments);

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

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [profile, subscribeToDocuments, subscribeToProjects, subscribeToTasks]);

  return null;
}
