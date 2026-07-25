import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthGate } from '@/src/features/auth';
import { adminRoutes } from './adminRoutes';
import { legacyRoutes } from './legacyRoutes';
import { publicRoutes } from './publicRoutes';
import { userRoutes } from './userRoutes';

export function AppRoutes() {
  return (
    <Routes>
      {publicRoutes.map(route => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {userRoutes.map(route => (
        <Route
          key={route.path}
          path={route.path}
          element={<AuthGate role="user">{route.element}</AuthGate>}
        />
      ))}

      {adminRoutes.map(route => (
        <Route
          key={route.path}
          path={route.path}
          element={<AuthGate>{route.element}</AuthGate>}
        />
      ))}

      {legacyRoutes.map(route => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
