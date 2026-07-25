export { AuthGate, AuthLanding, AuthProvider } from './components/AuthGate';
export { default as ChangePasswordPage } from './pages/ChangePasswordPage';
export { default as ForgotPasswordPage } from './pages/ForgotPasswordPage';
export { default as ResetPasswordPage } from './pages/ResetPasswordPage';
export { default as SignInPage } from './pages/SignInPage';
export { useAuthStore } from './stores/authStore';
export {
  ADMIN_AREA_ROLES,
  ADMIN_ROLE,
  ROLE_LABELS,
  STAFF_ROLES,
  SUPERADMIN_ROLE,
  USER_ROLE,
  canAccessRole,
  defaultRouteForRole,
  isStaffRole,
} from './access/roleAccess';
export { can, permissions } from './access/permissions';
export type {
  AuthProfile,
  AuthProfileUpdateInput,
  AuthRole,
  FeatureAccess,
  LocalTimestamp,
  StaffRole,
} from './types';
