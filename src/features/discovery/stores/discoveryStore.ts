import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnswerValue, DiscoveryStatus, ProjectDiscovery } from '../types';
import type { ServiceType } from '@/src/features/projects';

interface DiscoveryState {
  discoveries: ProjectDiscovery[];

  /** Get the discovery record for a project (undefined = not started). */
  getDiscovery: (projectId: string) => ProjectDiscovery | undefined;

  /** Save/update answers. Creates the record if it doesn't exist. */
  saveDiscovery: (params: {
    projectId: string;
    serviceType: ServiceType;
    answers: Record<string, AnswerValue>;
    status: DiscoveryStatus;
    userId: string;
  }) => void;

  /** Delete a project's discovery (for cleanup when project is deleted). */
  deleteDiscovery: (projectId: string) => void;
}

export const useDiscoveryStore = create<DiscoveryState>()(
  persist(
    (set, get) => ({
      discoveries: [],

      getDiscovery: (projectId) =>
        get().discoveries.find(d => d.projectId === projectId),

      saveDiscovery: ({ projectId, serviceType, answers, status, userId }) => {
        const now = Date.now();
        set(state => {
          const existing = state.discoveries.find(d => d.projectId === projectId);

          if (existing) {
            return {
              discoveries: state.discoveries.map(d =>
                d.projectId !== projectId ? d : {
                  ...d,
                  answers,
                  status,
                  savedAt: now,
                  savedBy: userId,
                  // Only set submittedAt/By on first submission
                  ...(status === 'submitted' && !d.submittedAt
                    ? { submittedAt: now, submittedBy: userId }
                    : {}),
                },
              ),
            };
          }

          const record: ProjectDiscovery = {
            projectId,
            serviceType,
            answers,
            status,
            savedAt: now,
            savedBy: userId,
            ...(status === 'submitted'
              ? { submittedAt: now, submittedBy: userId }
              : {}),
          };
          return { discoveries: [...state.discoveries, record] };
        });
      },

      deleteDiscovery: (projectId) =>
        set(state => ({
          discoveries: state.discoveries.filter(d => d.projectId !== projectId),
        })),
    }),
    { name: 'discovery-store' },
  ),
);
