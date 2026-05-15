import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, type AuthRole } from '@/src/store/auth';
import { isFirebaseConfigured } from '@/src/lib/firebase';
import { AppLoader } from '../app-loader/app-loader';

interface AuthGateProps {
  children: React.ReactNode;
  role?: 'admin' | 'client';
}

const isAdminRole = (role?: AuthRole | null) =>
  role === 'superadmin' || role === 'admin' || role === 'freelancer';

const routeForRole = (role?: AuthRole | null) => role === 'client' ? '/user' : '/admin';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initAuthListener = useAuthStore(state => state.initAuthListener);

  useEffect(() => initAuthListener(), [initAuthListener]);

  return <>{children}</>;
}

export function AuthGate({ children, role }: AuthGateProps) {
  const location = useLocation();
  const ready = useAuthStore(state => state.ready);
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const error = useAuthStore(state => state.error);
  const signOutUser = useAuthStore(state => state.signOutUser);

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
          <button
            type="button"
            onClick={() => signOutUser()}
            className="button mt-4 inline-flex rounded-xl bg-(--color-ink) px-4 py-2 text-sm font-semibold text-white"
          >
            Back to sign in
          </button>
        </div>
      </main>
    );
  }

  if (role === 'client' && profile.role !== 'client') {
    return <Navigate to={routeForRole(profile.role)} replace />;
  }

  if (role === 'admin' && !isAdminRole(profile.role)) {
    return <Navigate to={routeForRole(profile.role)} replace />;
  }

  return <>{children}</>;
}

export function AuthLanding() {
  const ready = useAuthStore(state => state.ready);
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);

  if (!isFirebaseConfigured || !ready || !user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Navigate to={routeForRole(profile?.role)} replace />;
}
