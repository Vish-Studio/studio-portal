import { auth, db, isFirebaseConfigured } from './config';
import { FEEDBACK_MESSAGES } from '@/src/app/messages';

export const requireFirebase = () => {
  if (!auth || !db || !isFirebaseConfigured) {
    throw new Error(FEEDBACK_MESSAGES.common.firebaseNotConfigured);
  }

  return { auth, db };
};
