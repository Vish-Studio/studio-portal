import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Check, Eye, EyeOff, KeyRound, LogOut } from '@/src/shared/components/material-icon/material-lucide-icons';
import { AppLoader } from '@/src/app/components/loading';
import { defaultRouteForRole } from '../access/roleAccess';
import { Button, FormField, TextInput } from '@/src/shared/components';
import { FEEDBACK_MESSAGES } from '@/src/app/messages';
import { useAuthStore } from '../stores/authStore';

interface ChangePasswordFormValues {
  password: string;
  confirmPassword: string;
}

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const ready = useAuthStore(state => state.ready);
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const completeRequiredPasswordChange = useAuthStore(state => state.completeRequiredPasswordChange);
  const signOutUser = useAuthStore(state => state.signOutUser);
  const authError = useAuthStore(state => state.error);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: { password: '', confirmPassword: '' },
  });

  if (!ready) {
    return (
      <AppLoader
        title="Checking session"
        description="Preparing your password update..."
        eyebrow="Account security"
      />
    );
  }

  if (!user || !profile) {
    return <Navigate to="/sign-in" replace state={{ from: '/change-password' }} />;
  }

  if (!profile.needsPasswordChange) {
    return <Navigate to={defaultRouteForRole(profile.role)} replace />;
  }

  const password = watch('password');
  const fromPath = typeof location.state === 'object' && location.state && 'from' in location.state
    ? String(location.state.from)
    : defaultRouteForRole(profile.role);

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setSubmitError(null);

    try {
      const updatedProfile = await completeRequiredPasswordChange(values.password);
      const defaultPath = defaultRouteForRole(updatedProfile.role);
      const allowedPrefix = updatedProfile.role === 'user' ? '/user' : '/admin';
      navigate(fromPath.startsWith(allowedPrefix) ? fromPath : defaultPath, { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : FEEDBACK_MESSAGES.auth.updatePasswordFailed);
    }
  };

  return (
    <main className="change-password min-h-screen bg-white p-3 font-sans text-(--color-ink) sm:p-4">
      <div className="change-password-shell grid min-h-[calc(100vh-24px)] bg-white lg:grid-cols-[1.08fr_0.92fr] lg:gap-4">
        <section className="change-password-brand hidden rounded-[28px] bg-(--color-sidebar-bg) px-7 py-7 text-white lg:flex lg:min-h-0 lg:flex-col">
          <div className="change-password-logo flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-(--color-sidebar-border-dark)">
              <img src="/assets/logo-white-trans.png" alt="Studio Portal logo" width={34} height={34} />
            </div>
            <span className="brand-wordmark text-lg">
              studio <span className="brand-wordmark-light text-white/70">portal</span>
            </span>
          </div>

          <div className="change-password-copy flex flex-1 items-center pt-8">
            <div className="max-w-xl">
              <p className="mb-3 inline-flex rounded-full bg-white/8 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/50">
                Required update
              </p>
              <h1 className="text-[48px] font-bold leading-[1.04] tracking-tight xl:text-[56px]">
                Set a private password before continuing.
              </h1>
              <p className="mt-4 max-w-md text-sm font-medium leading-6 text-white/45">
                Your account was created with a temporary password. Choose a new one to unlock the portal.
              </p>
            </div>
          </div>
        </section>

        <section className="change-password-panel flex min-h-[calc(100vh-24px)] items-center justify-center px-2 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="change-password-card w-full max-w-[420px]">
            <div className="mb-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-(--color-accent-lime) text-(--color-ink)">
                <KeyRound size={23} />
              </div>
              <p className="mb-3 inline-flex rounded-full bg-(--color-accent-lime) px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-950">
                Password change
              </p>
              <h2 className="text-[32px] font-bold leading-tight tracking-tight text-gray-950">
                Create your new password
              </h2>
              <p className="mt-2 text-sm font-medium leading-6 text-gray-400">
                Signed in as {profile.email}. This only needs to be done once.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="change-password-form flex flex-col gap-4">
              <FormField label="New password" required error={errors.password?.message}>
                <div className="relative">
                  <TextInput
                    id="required-new-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="New password"
                    hasError={!!errors.password}
                    className="pr-11"
                    {...register('password', {
                      required: 'New password is required',
                      minLength: { value: 8, message: 'Use at least 8 characters' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(value => !value)}
                    className="change-password-toggle absolute right-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-500"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </FormField>

              <FormField label="Confirm password" required error={errors.confirmPassword?.message}>
                <div className="relative">
                  <TextInput
                    id="required-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    hasError={!!errors.confirmPassword}
                    className="pr-11"
                    {...register('confirmPassword', {
                      required: 'Confirm your new password',
                      validate: value => value === password || 'Passwords do not match',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(value => !value)}
                    className="change-password-confirm-toggle absolute right-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-500"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </FormField>

              <Button
                type="submit"
                loading={isSubmitting}
                className="h-12 w-full font-bold tracking-tight active:scale-[0.98]"
              >
                <Check size={16} />
                Update password
              </Button>

              {(submitError || authError) && (
                <p className="change-password-error rounded-[12px] bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                  {submitError || authError}
                </p>
              )}
            </form>

            <button
              type="button"
              onClick={() => signOutUser()}
              className="change-password-sign-out mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900"
            >
              <LogOut size={15} />
              Sign out instead
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
