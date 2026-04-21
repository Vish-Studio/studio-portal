import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
    console.error("Please check your Firebase configuration or internet connection.");
    return;
  }
  
  if (error instanceof Error && error.message.includes("quota")) {
      console.error("Quota exceeded limit.");
  }
  
  const errInfo: FirestoreErrorInfo = {
    error: error.message || 'Unknown error',
    operationType,
    path,
    authInfo: {}
  };
  console.error("Firestore Error:", JSON.stringify(errInfo));
  throw error;
}
