import {
  AuthLanding,
  ChangePasswordPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  SignInPage,
} from '@/src/features/auth';
import { WalkthroughPage } from '@/src/features/walkthrough';
import type { AppRouteDefinition } from './types';

export const publicRoutes: AppRouteDefinition[] = [
  { path: '/', element: <AuthLanding /> },
  { path: '/sign-in', element: <SignInPage /> },
  { path: '/change-password', element: <ChangePasswordPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/walkthrough', element: <WalkthroughPage /> },
];
