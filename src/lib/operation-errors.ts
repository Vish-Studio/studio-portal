import { FEEDBACK_MESSAGES } from '@/src/app/messages';

const errorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object') {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return '';
};

export const logOperationError = (context: string, error: unknown) => {
  console.log('[Operation error]', {
    context,
    name: error instanceof Error ? error.name : undefined,
    message: errorMessage(error) || String(error),
    error,
  });
};

export const operationErrorMessage = (error: unknown) =>
  errorMessage(error) || FEEDBACK_MESSAGES.common.genericError;
