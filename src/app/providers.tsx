import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/src/features/auth';
import { ToastViewport } from '@/src/app/components/feedback/ToastViewport';
import { AppLoadingGate } from '@/src/app/components/loading/AppLoadingGate';
import { GlobalOperationLoader } from '@/src/app/components/loading/GlobalOperationLoader';
import { FirestoreStreams } from '@/src/app/components/FirestoreStreams';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FirestoreStreams />
        <AppLoadingGate>{children}</AppLoadingGate>
        <GlobalOperationLoader />
        <ToastViewport />
      </AuthProvider>
    </BrowserRouter>
  );
}
