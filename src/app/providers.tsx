import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/src/features/auth';
import { ToastViewport } from '@/src/app/components/feedback/ToastViewport';
import { AppLoadingGate } from '@/src/app/components/loading/AppLoadingGate';
import { GlobalOperationLoader } from '@/src/app/components/loading/GlobalOperationLoader';

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
