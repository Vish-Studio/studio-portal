import type { AuthProfile } from '@/src/features/auth';

const WALKTHROUGH_PREFIX = 'studio-portal-walkthrough-complete';

const storageKeyForProfile = (profile?: AuthProfile | null) => {
  const id = profile?.uid || profile?.id || profile?.email || 'local';
  return `${WALKTHROUGH_PREFIX}:${id}`;
};

export const hasCompletedWalkthrough = (profile?: AuthProfile | null) => {
  if (!profile) return false;
  return localStorage.getItem(storageKeyForProfile(profile)) === 'true';
};

export const markWalkthroughComplete = (profile?: AuthProfile | null) => {
  if (!profile) return;
  localStorage.setItem(storageKeyForProfile(profile), 'true');
};

export const resetWalkthrough = (profile?: AuthProfile | null) => {
  if (!profile) return;
  localStorage.removeItem(storageKeyForProfile(profile));
};
