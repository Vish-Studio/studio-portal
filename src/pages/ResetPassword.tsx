import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Check, Eye, EyeOff, KeyRound, ShieldAlert } from 'lucide-react';
import Button from '../components/common/button/button';
import FormField, { inputCls } from '../components/common/form-field/form-field';
import { isFirebaseConfigured } from '../firebase/config';
import { useAuthStore } from '../store/auth';

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

type ResetStatus = 'checking' | 'ready' | 'invalid' | 'success';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode') ?? '';
  const mode = searchParams.get('mode');
  const verifyPasswordReset = useAuthStore(state => state.verifyPasswordReset);
  const confirmPasswordReset = useAuthStore(state => state.confirmPasswordReset);
  const authError = useAuthStore(state => state.error);
  const [status, setStatus] = useState<ResetStatus>('checking');
  const [resetEmail, setResetEmail] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    let mounted = true;

    if (!oobCode || (mode && mode !== 'resetPassword')) {
      setStatus('invalid');
      return () => {
        mounted = false;
      };
    }

    verifyPasswordReset(oobCode)
      .then(email => {
        if (!mounted) return;
        setResetEmail(email);
        setStatus('ready');
      })
      .catch(() => {
        if (!mounted) return;
        setStatus('invalid');
      });

    return () => {
      mounted = false;
    };
  }, [mode, oobCode, verifyPasswordReset]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setSubmitError(null);

    try {
      await confirmPasswordReset(oobCode, values.password);
      setStatus('success');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to reset password.');
    }
  };

  const password = watch('password');

  return (
    <main className="reset-password min-h-screen bg-white p-3 font-sans text-(--color-ink) sm:p-4">
      <div className="reset-password-shell grid min-h-[calc(100vh-24px)] bg-white lg:grid-cols-[1.08fr_0.92fr] lg:gap-4">
        <section className="reset-password-brand hidden rounded-[28px] bg-(--color-sidebar-bg) px-7 py-7 text-white lg:flex lg:min-h-0 lg:flex-col">
          <div className="reset-password-logo flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-(--color-sidebar-border-dark)">
              <img src="/assets/logo-white-trans.png" alt="Studio Portal logo" width={34} height={34} />
            </div>
            <span className="text-lg font-bold tracking-tight">
              studio <span className="font-normal text-white/70">portal</span>
            </span>
          </div>

          <div className="reset-password-copy flex flex-1 items-center pt-8">
            <div className="max-w-xl">
              <p className="mb-3 inline-flex rounded-full bg-white/8 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/50">
                Account security
              </p>
              <h1 className="text-[48px] font-bold leading-[1.04] tracking-tight xl:text-[56px]">
                Create a new password and get back to work.
              </h1>
              <p className="mt-4 max-w-md text-sm font-medium leading-6 text-white/45">
                Use the secure Firebase reset link from your email to update your account access.
              </p>
            </div>
          </div>
        </section>

        <section className="reset-password-panel flex min-h-[calc(100vh-24px)] items-center justify-center px-2 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="reset-password-card w-full max-w-[420px]">
            <Link
              to="/sign-in"
              className="reset-password-back mb-8 inline-flex items-center gap-2 text-xs font-bold text-gray-400 transition-colors hover:text-gray-900"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>

            {status === 'checking' && (
              <div className="reset-password-checking rounded-[22px] border border-gray-200 bg-gray-50 p-6">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-white text-(--color-ink)">
                  <KeyRound size={23} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-950">Checking reset link</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-gray-400">
                  We are verifying this password reset request.
                </p>
              </div>
            )}

            {status === 'invalid' && (
              <div className="reset-password-invalid">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-red-50 text-red-500">
                  <ShieldAlert size={24} />
                </div>
                <p className="mb-3 inline-flex rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-600">
                  Invalid link
                </p>
                <h2 className="text-[32px] font-bold leading-tight tracking-tight text-gray-950">
                  Reset link expired
                </h2>
                <p className="mt-2 text-sm font-medium leading-6 text-gray-400">
                  This password reset link is missing, expired, or has already been used.
                </p>
                <Link
                  to="/forgot-password"
                  className="button type-control mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-(--color-ink) px-4 font-bold text-white transition-colors hover:bg-gray-800"
                >
                  Send a new link
                </Link>
              </div>
            )}

            {status === 'success' && (
              <div className="reset-password-success">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-(--color-accent-lime) text-(--color-ink)">
                  <Check size={24} />
                </div>
                <p className="mb-3 inline-flex rounded-full bg-(--color-accent-lime) px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-950">
                  Password updated
                </p>
                <h2 className="text-[32px] font-bold leading-tight tracking-tight text-gray-950">
                  You can sign in now
                </h2>
                <p className="mt-2 text-sm font-medium leading-6 text-gray-400">
                  Your password was updated successfully. Use the new password the next time you sign in.
                </p>
                <Link
                  to="/sign-in"
                  className="button type-control mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-(--color-ink) px-4 font-bold text-white transition-colors hover:bg-gray-800"
                >
                  Return to sign in
                </Link>
              </div>
            )}

            {status === 'ready' && (
              <>
                <div className="reset-password-heading mb-8">
                  <p className="mb-3 inline-flex rounded-full bg-(--color-accent-lime) px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-950">
                    New password
                  </p>
                  <h2 className="text-[32px] font-bold leading-tight tracking-tight text-gray-950">
                    Reset your password
                  </h2>
                  <p className="mt-2 text-sm font-medium leading-6 text-gray-400">
                    {resetEmail ? `Create a new password for ${resetEmail}.` : 'Create a new password for your account.'}
                  </p>
                  {!isFirebaseConfigured && (
                    <div className="mt-4 rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3">
                      <p className="text-xs font-semibold leading-5 text-amber-800">
                        Firebase is not configured yet. Add the VITE_FIREBASE_* values to `.env.local`.
                      </p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="reset-password-form flex flex-col gap-4">
                  <FormField label="New password" required error={errors.password?.message}>
                    <div className="relative">
                      <input
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="New password"
                        className={`${inputCls(!!errors.password)} pr-11`}
                        {...register('password', {
                          required: 'New password is required',
                          minLength: { value: 8, message: 'Use at least 8 characters' },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(value => !value)}
                        className="reset-password-toggle absolute right-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-500"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </FormField>

                  <FormField label="Confirm password" required error={errors.confirmPassword?.message}>
                    <div className="relative">
                      <input
                        id="confirm-new-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Confirm password"
                        className={`${inputCls(!!errors.confirmPassword)} pr-11`}
                        {...register('confirmPassword', {
                          required: 'Confirm your new password',
                          validate: value => value === password || 'Passwords do not match',
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(value => !value)}
                        className="reset-password-confirm-toggle absolute right-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-500"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </FormField>

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={!isFirebaseConfigured}
                    className="h-12 w-full font-bold tracking-tight active:scale-[0.98]"
                  >
                    Update password
                  </Button>

                  {(submitError || authError) && (
                    <p className="reset-password-error rounded-[12px] bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
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
