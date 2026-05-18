import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/src/components/common/auth-gate/auth-gate';
import { AppLoadingGate } from '@/src/components/common/app-loading-gate/app-loading-gate';
import { GlobalOperationLoader } from '@/src/components/common/global-operation-loader/global-operation-loader';
import { ToastViewport } from '@/src/components/common/toast/toast-viewport';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLoadingGate>{children}</AppLoadingGate>
        <GlobalOperationLoader />
        <ToastViewport />
      </AuthProvider>
    </BrowserRouter>
  );
}

