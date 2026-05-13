import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, type AuthRole } from '@/src/store/auth';
import { isFirebaseConfigured } from '@/src/lib/firebase';

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
      <main className="auth-gate flex min-h-screen items-center justify-center bg-white p-6">
        <div className="auth-gate-card rounded-[18px] bg-(--color-surface-alt) px-6 py-5 text-center">
          <p className="type-card-title text-(--color-ink)">Checking session</p>
          <p className="type-muted mt-1 text-gray-400">Please wait...</p>
        </div>
      </main>
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

  if (role && profile?.role !== role) {
    return <Navigate to={profile.role === 'client' ? '/user' : '/admin'} replace />;
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

  return <Navigate to={profile?.role === 'client' ? '/user' : '/admin'} replace />;
}
