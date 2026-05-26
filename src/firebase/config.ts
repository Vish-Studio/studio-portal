import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FEEDBACK_MESSAGES } from '@/src/app/messages';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredKeys = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
];

export const isFirebaseConfigured = requiredKeys.every(Boolean);

let app: FirebaseApp | null = null;
let provisioningAuth: Auth | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
}

export const firebaseApp = app;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export const getProvisioningAuth = () => {
  if (!isFirebaseConfigured) {
    throw new Error(FEEDBACK_MESSAGES.common.firebaseNotConfigured);
  }

  if (!provisioningAuth) {
    const provisioningApp = getApps().some(item => item.name === 'user-provisioning')
      ? getApp('user-provisioning')
      : initializeApp(firebaseConfig, 'user-provisioning');
    provisioningAuth = getAuth(provisioningApp);
  }

  return provisioningAuth;
};
