import { auth, db, isFirebaseConfigured } from '@/src/lib/firebase';

export const requireFirebase = () => {
  if (!auth || !db || !isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* values to your .env.local file.');
  }

  return { auth, db };
};
