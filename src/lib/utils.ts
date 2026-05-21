import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FEEDBACK_MESSAGES } from '@/src/app/feedbackMessages';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Error handling helper
export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: any, operationType: any, path: string | null = null) {
  if (error instanceof Error && error.message.includes("the client is offline")) {
    console.log('[Firebase error]', FEEDBACK_MESSAGES.common.firebaseConnectionIssue);
    return;
  }
  
  if (error instanceof Error && error.message.includes("quota")) {
      console.log('[Firebase error]', FEEDBACK_MESSAGES.common.firebaseQuotaExceeded);
  }
  
  const errInfo: FirestoreErrorInfo = {
    error: error.message || 'Unknown error',
    operationType,
    path,
    authInfo: {}
  };
  console.log('[Firebase error]', JSON.stringify(errInfo));
  throw error;
}
