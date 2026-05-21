import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckSquare,
  CreditCard,
  Eye,
  EyeOff,
} from '@/src/shared/components/material-icon/material-lucide-icons';
import { Button, Checkbox, FormField, TextInput } from '@/src/shared/components';
import { isFirebaseConfigured } from '@/src/firebase/config';
import { FEEDBACK_MESSAGES } from '@/src/app/feedbackMessages';
import { useAuthStore } from '../stores/authStore';
import type { AuthRole } from '@/src/types/auth';

interface SignInFormValues {
  email: string;
  password: string;
}

const highlights = [
  { icon: Briefcase, label: 'Projects', value: '12', meta: '7 active' },
  { icon: CheckSquare, label: 'Tasks', value: '36', meta: '14 moving' },
  { icon: Calendar, label: 'Schedule', value: '08', meta: 'this week' },
  { icon: CreditCard, label: 'Payments', value: '$56k', meta: 'collected' },
];

const isClientRole = (role: AuthRole) => role === 'client';

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useAuthStore(state => state.signIn);
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const authError = useAuthStore(state => state.error);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: SignInFormValues) => {
    setSubmitError(null);
    try {
      const nextProfile = await signIn(values.email, values.password);
      if (nextProfile.needsPasswordChange) {
        navigate('/change-password', { replace: true, state: { from: location.state?.from } });
        return;
      }

      const fallbackPath = isClientRole(nextProfile.role) ? '/user' : '/admin';
      const requestedPath = typeof location.state === 'object' && location.state && 'from' in location.state
        ? String(location.state.from)
        : fallbackPath;
      navigate(requestedPath.startsWith(`/${isClientRole(nextProfile.role) ? 'user' : 'admin'}`) ? requestedPath : fallbackPath, {
        replace: true,
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : FEEDBACK_MESSAGES.auth.signInFailed);
    }
  };

  if (user && profile) {
    if (profile.needsPasswordChange) {
      return <Navigate to="/change-password" replace />;
    }

    return <Navigate to={isClientRole(profile.role) ? '/user' : '/admin'} replace />;
  }

  return (
    <main className="sign-in min-h-screen bg-white p-3 font-sans text-(--color-ink) sm:p-4">
      <div className="sign-in-shell grid min-h-[calc(100vh-24px)] grid-rows-[auto_1fr_auto] bg-white lg:grid-rows-none lg:grid-cols-[1.08fr_0.92fr] lg:gap-4">
        <section className="sign-in-brand contents text-white lg:flex lg:min-h-0 lg:flex-col lg:rounded-[28px] lg:bg-(--color-sidebar-bg) lg:px-7 lg:py-7">
          <div className="order-1 flex items-center gap-3 px-2 py-2 sm:px-3 sm:py-3 lg:px-0 lg:py-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-(--color-sidebar-bg) lg:border lg:border-(--color-sidebar-border-dark) lg:bg-transparent">
              <img src="/assets/logo-white-trans.png" alt="Studio Portal logo" width={34} height={34} />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-950 lg:text-white">
              studio <span className="font-normal text-gray-500 lg:text-white/70">portal</span>
            </span>
          </div>

          <div className="sign-in-brand-content order-3 mt-2 flex flex-1 flex-col justify-center rounded-[28px] bg-(--color-sidebar-bg) px-5 py-6 sm:px-7 sm:py-7 lg:mt-0 lg:min-h-0 lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0 lg:pt-8">
            <div className="max-w-xl">
              <p className="mb-3 inline-flex rounded-full bg-white/8 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/50">
                Studio operations
              </p>
              <h1 className="text-[34px] font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-[52px] xl:text-[56px]">
                A focused workspace for client work.
              </h1>
              <p className="mt-4 max-w-md text-sm font-medium leading-6 text-white/45 sm:text-base">
                Track projects, schedules, tasks, payments, and documents from one calm admin surface.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 lg:max-w-xl xl:mt-10">
              {highlights.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-[18px] border border-white/8 bg-white/[0.04] p-4">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-white/8 text-white/70">
                        <Icon size={17} />
                      </div>
                      <span className="text-xl font-bold tabular-nums">{item.value}</span>
                    </div>
                    <p className="text-sm font-semibold text-white/90">{item.label}</p>
                    <p className="mt-0.5 text-xs font-medium text-white/35">{item.meta}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="sign-in-panel order-2 flex min-h-0 items-center justify-center bg-white px-2 py-8 sm:px-8 lg:order-none lg:min-h-[calc(100vh-24px)] lg:px-12 lg:py-10">
          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <p className="mb-3 inline-flex rounded-full bg-(--color-accent-lime) px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-950">
                Secure sign in
              </p>
              <h2 className="text-[32px] font-bold leading-tight tracking-tight text-gray-950">
                Welcome back
              </h2>
              <p className="mt-2 text-sm font-medium text-gray-400">
                Enter your details to continue managing the studio.
              </p>
              {!isFirebaseConfigured && (
                <div className="mt-4 rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3">
                  <p className="text-xs font-semibold leading-5 text-amber-800">
                    Firebase is not configured yet. Add the VITE_FIREBASE_* values to `.env.local`.
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField label="Email" required error={errors.email?.message}>
                <TextInput
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@studio.com"
                  hasError={!!errors.email}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
              </FormField>

              <FormField label="Password" required error={errors.password?.message}>
                <div className="relative">
                  <TextInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Password"
                    hasError={!!errors.password}
                    className="pr-11"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Use at least 6 characters' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(value => !value)}
                    className="absolute right-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-500"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </FormField>

              <div className="flex items-center justify-between gap-3">
                <Checkbox
                  label="Remember me"
                  className="items-center gap-2"
                  labelClassName="text-xs font-semibold text-gray-400"
                />
                <Link to="/forgot-password" className="text-xs font-bold text-gray-500 transition-colors hover:text-gray-900">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                loading={isSubmitting}
                disabled={!isFirebaseConfigured}
                iconRight={!isSubmitting ? <ArrowRight size={15} /> : undefined}
                className="mt-1 h-12 w-full font-bold tracking-tight active:scale-[0.98]"
              >
                Sign in
              </Button>
              {(submitError || authError) && (
                <p className="rounded-[12px] bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                  {submitError || authError}
                </p>
              )}
            </form>

            <p className="mt-5 text-center text-[12px] text-gray-400">
              Need access? Ask the studio admin to create your account.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SignInPage;
