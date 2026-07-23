import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, type AuthRole } from '@/src/features/auth';
import { defaultRouteForRole } from '@/src/auth/roleAccess';
import { AppLoader } from '@/src/app/components/loading';
import { hasCompletedWalkthrough } from '@/src/features/walkthrough/walkthroughStorage';

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
  const setAccessRole = useAuthStore(state => state.setAccessRole);
  const ready = useAuthStore(state => state.ready);
  const profile = useAuthStore(state => state.profile);
  const location = useLocation();

  useEffect(() => {
    if (role) {
      setAccessRole(role);
      return;
    }

    if (!profile || profile.role === 'user') {
      setAccessRole('superadmin');
    }
  }, [profile, role, setAccessRole]);

  if (!ready) {
    return (
      <AppLoader
        title="Checking session"
        description="Preparing your dashboard..."
        eyebrow="Session status"
      />
    );
  }

  if (profile?.needsPasswordChange) {
    return <Navigate to="/change-password" replace state={{ from: location.pathname }} />;
  }

  if (profile && !hasCompletedWalkthrough(profile)) {
    return <Navigate to="/walkthrough" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export function AuthLanding() {
  const ready = useAuthStore(state => state.ready);
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);

  if (!ready || !user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (profile?.needsPasswordChange) {
    return <Navigate to="/change-password" replace />;
  }

  if (profile && !hasCompletedWalkthrough(profile)) {
    return <Navigate to="/walkthrough" replace state={{ from: defaultRouteForRole(profile.role) }} />;
  }

  return <Navigate to={defaultRouteForRole(profile?.role)} replace />;
}
