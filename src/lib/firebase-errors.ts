import { FEEDBACK_MESSAGES } from '@/src/app/feedbackMessages';

type FirebaseLikeError = {
  code?: unknown;
  name?: unknown;
  message?: unknown;
};

const firebaseCode = (error: unknown) => {
  if (!error || typeof error !== 'object') return '';
  const code = (error as FirebaseLikeError).code;
  return typeof code === 'string' ? code : '';
};

const errorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object') {
    const message = (error as FirebaseLikeError).message;
    if (typeof message === 'string') return message;
  }
  return '';
};

export const isFirebasePermissionError = (error: unknown) => {
  const code = firebaseCode(error);
  const message = errorMessage(error).toLowerCase();
  return code === 'permission-denied' ||
    code === 'firestore/permission-denied' ||
    message.includes('missing or insufficient permissions');
};

export const logFirebaseError = (context: string, error: unknown) => {
  const code = firebaseCode(error);
  const message = errorMessage(error);
  const name = error instanceof Error ? error.name : undefined;

  console.log('[Firebase error]', {
    context,
    code: code || undefined,
    name,
    message: message || String(error),
    error,
  });
};

export const firebaseErrorMessage = (error: unknown) => {
  if (isFirebasePermissionError(error)) return FEEDBACK_MESSAGES.common.firebasePermissionDenied;
  const message = errorMessage(error);
  if (!message) return FEEDBACK_MESSAGES.common.genericError;

  if (message.includes('auth/invalid-credential')) return FEEDBACK_MESSAGES.auth.invalidCredentials;
  if (message.includes('auth/operation-not-allowed')) return FEEDBACK_MESSAGES.auth.emailPasswordDisabled;
  if (message.includes('auth/user-not-found')) return FEEDBACK_MESSAGES.auth.userNotFound;
  if (message.includes('auth/wrong-password')) return FEEDBACK_MESSAGES.auth.invalidCredentials;
  if (message.includes('auth/too-many-requests')) return FEEDBACK_MESSAGES.auth.tooManyRequests;
  if (message.includes('auth/invalid-email')) return FEEDBACK_MESSAGES.auth.invalidEmail;
  if (message.includes('auth/requires-recent-login')) return FEEDBACK_MESSAGES.auth.recentLoginRequired;
  if (message.includes('auth/email-already-in-use')) return FEEDBACK_MESSAGES.auth.emailAlreadyInUse;

  return message;
};
