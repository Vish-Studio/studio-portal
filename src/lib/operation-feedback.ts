import { useUIStore } from "@/src/app/stores/uiStore";
import { logOperationError } from "./operation-errors";

interface OperationFeedbackOptions<T> {
  loadingLabel: string;
  successTitle?: string;
  successMessage?: string;
  errorTitle: string;
  action: () => Promise<T>;
}

export async function runOperationWithFeedback<T>({
  loadingLabel,
  successTitle,
  successMessage,
  errorTitle,
  action,
}: OperationFeedbackOptions<T>) {
  const { beginOperation, endOperation, showToast } = useUIStore.getState();
  const operationId = beginOperation(loadingLabel);

  try {
    const result = await action();

    if (successTitle) {
      showToast({
        status: "success",
        title: successTitle,
        message: successMessage,
      });
    }

    return result;
  } catch (error) {
    logOperationError(errorTitle, error);
    const message = error instanceof Error ? error.message : errorTitle;
    showToast({
      status: "error",
      title: errorTitle,
      message,
    });
    throw error instanceof Error ? error : new Error(message);
  } finally {
    endOperation(operationId);
  }
}
