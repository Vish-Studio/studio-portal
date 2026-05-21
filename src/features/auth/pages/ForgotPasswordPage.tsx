import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, MailCheck } from '@/src/shared/components/material-icon/material-lucide-icons';
import { Button, FormField, TextInput } from '@/src/shared/components';
import { isFirebaseConfigured } from '@/src/firebase/config';
import { FEEDBACK_MESSAGES } from '@/src/app/feedbackMessages';
import { useAuthStore } from '../stores/authStore';

interface ForgotPasswordFormValues {
  email: string;
}

export default function ForgotPasswordPage() {
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const sendPasswordReset = useAuthStore(state => state.sendPasswordReset);
  const authError = useAuthStore(state => state.error);
  const [sentTo, setSentTo] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setSubmitError(null);
    try {
      await sendPasswordReset(values.email);
      setSentTo(values.email);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : FEEDBACK_MESSAGES.auth.resetEmailFailed);
    }
  };

  if (user && profile) {
    return <Navigate to={profile.role === 'client' ? '/user' : '/admin'} replace />;
  }

  return (
    <main className="forgot-password min-h-screen bg-white p-3 font-sans text-(--color-ink) sm:p-4">
      <div className="forgot-password-shell grid min-h-[calc(100vh-24px)] bg-white lg:grid-cols-[1.08fr_0.92fr] lg:gap-4">
        <section className="forgot-password-brand hidden rounded-[28px] bg-(--color-sidebar-bg) px-7 py-7 text-white lg:flex lg:min-h-0 lg:flex-col">
          <div className="forgot-password-logo flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-(--color-sidebar-border-dark)">
              <img src="/assets/logo-white-trans.png" alt="Studio Portal logo" width={34} height={34} />
            </div>
            <span className="text-lg font-bold tracking-tight">
              studio <span className="font-normal text-white/70">portal</span>
            </span>
          </div>

          <div className="forgot-password-copy flex flex-1 items-center pt-8">
            <div className="max-w-xl">
              <p className="mb-3 inline-flex rounded-full bg-white/8 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/50">
                Account recovery
              </p>
              <h1 className="text-[48px] font-bold leading-[1.04] tracking-tight xl:text-[56px]">
                Reset access without disrupting work.
              </h1>
              <p className="mt-4 max-w-md text-sm font-medium leading-6 text-white/45">
                We will send a secure reset link to your email and bring you back into the app to create a new password.
              </p>
            </div>
          </div>
        </section>

        <section className="forgot-password-panel flex min-h-[calc(100vh-24px)] items-center justify-center px-2 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="forgot-password-card w-full max-w-[420px]">
            <Link
              to="/sign-in"
              className="forgot-password-back mb-8 inline-flex items-center gap-2 text-xs font-bold text-gray-400 transition-colors hover:text-gray-900"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>

            {sentTo ? (
              <div className="forgot-password-success">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-(--color-accent-lime) text-(--color-ink)">
                  <MailCheck size={24} />
                </div>
                <p className="mb-3 inline-flex rounded-full bg-(--color-accent-lime) px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-950">
                  Check your email
                </p>
                <h2 className="text-[32px] font-bold leading-tight tracking-tight text-gray-950">
                  Reset link sent
                </h2>
                <p className="mt-2 text-sm font-medium leading-6 text-gray-400">
                  We sent password reset instructions to <span className="font-bold text-gray-700">{sentTo}</span>.
                  Open the email link, create a new password, then return to sign in.
                </p>
                <Link
                  to="/sign-in"
                  className="button type-control mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-(--color-ink) px-4 font-bold text-white transition-colors hover:bg-gray-800"
                >
                  Return to sign in
                </Link>
              </div>
            ) : (
              <>
                <div className="forgot-password-heading mb-8">
                  <p className="mb-3 inline-flex rounded-full bg-(--color-accent-lime) px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-950">
                    Forgot password
                  </p>
                  <h2 className="text-[32px] font-bold leading-tight tracking-tight text-gray-950">
                    Recover your account
                  </h2>
                  <p className="mt-2 text-sm font-medium leading-6 text-gray-400">
                    Enter your email and Firebase will send a secure password reset link.
                  </p>
                  {!isFirebaseConfigured && (
                    <div className="mt-4 rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3">
                      <p className="text-xs font-semibold leading-5 text-amber-800">
                        Firebase is not configured yet. Add the VITE_FIREBASE_* values to `.env.local`.
                      </p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="forgot-password-form flex flex-col gap-4">
                  <FormField label="Email" required error={errors.email?.message}>
                    <TextInput
                      id="reset-email"
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

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={!isFirebaseConfigured}
                    className="h-12 w-full font-bold tracking-tight active:scale-[0.98]"
                  >
                    Send reset link
                  </Button>

                  {(submitError || authError) && (
                    <p className="rounded-[12px] bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                      {submitError || authError}
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
