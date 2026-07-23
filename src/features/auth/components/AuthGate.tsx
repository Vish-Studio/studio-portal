import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, type AuthRole } from '@/src/features/auth';
import { AUTH_FLOW_ENABLED } from '@/src/features/auth/authMode';
import { isFirebaseConfigured } from '@/src/firebase/config';
import { defaultRouteForRole } from '@/src/auth/roleAccess';
import { AppLoader } from '@/src/app/components/loading';
import { Button } from '@/src/shared/components';

interface AuthGateProps {
  children: React.ReactNode;
  role?: AuthRole;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initAuthListener = useAuthStore(state => state.initAuthListener);

  useEffect(() => initAuthListener(), [initAuthListener]);

  return <>{children}</>;
}

export function AuthGate({ children, role }: AuthGateProps) {
  const location = useLocation();
  const setAccessRole = useAuthStore(state => state.setAccessRole);
  const ready = useAuthStore(state => state.ready);
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const error = useAuthStore(state => state.error);
  const signOutUser = useAuthStore(state => state.signOutUser);

  useEffect(() => {
    if (!AUTH_FLOW_ENABLED) {
      setAccessRole(role ?? 'superadmin');
    }
  }, [role, setAccessRole]);

  if (!AUTH_FLOW_ENABLED) {
    return <>{children}</>;
  }

  if (!isFirebaseConfigured) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  if (!ready) {
    return (
      <AppLoader
        title="Checking session"
        description="Preparing your dashboard..."
        eyebrow="Session status"
      />
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  if (!profile) {
    return (
      <main className="auth-gate flex min-h-screen items-center justify-center bg-white p-6">
        <div className="auth-gate-card max-w-sm rounded-[18px] bg-(--color-surface-alt) px-6 py-5 text-center">
          <p className="type-card-title text-(--color-ink)">Account profile unavailable</p>
          <p className="type-muted mt-1 text-gray-400">
            {error || 'Your Firebase user is signed in, but the app profile could not be loaded.'}
          </p>
          <Button onClick={() => signOutUser()} className="mt-4">
            Back to sign in
          </Button>
        </div>
      </main>
    );
  }

  if (profile.needsPasswordChange && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace state={{ from: location.pathname }} />;
  }

  if (role === 'user' && profile.role !== 'user') {
    return <Navigate to={defaultRouteForRole(profile.role)} replace />;
  }

  if (role === 'superadmin' && profile.role !== 'superadmin') {
    return <Navigate to={defaultRouteForRole(profile.role)} replace />;
  }

  return <>{children}</>;
}

export function AuthLanding() {
  const ready = useAuthStore(state => state.ready);
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);

  if (!AUTH_FLOW_ENABLED) {
    return <Navigate to="/admin" replace />;
  }

  if (!isFirebaseConfigured || !ready || !user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (profile?.needsPasswordChange) {
    return <Navigate to="/change-password" replace />;
  }

  return <Navigate to={defaultRouteForRole(profile?.role)} replace />;
}
