import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Zap, Shield, Users } from 'lucide-react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen flex bg-(--color-body-bg)">

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-(--color-sidebar-bg) flex-col justify-between p-10 xl:p-14 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="border border-(--color-sidebar-border-dark) rounded-[18px] flex items-center justify-center w-10 h-10">
            <img src="/assets/logo-white-trans.png" alt="Logo" width={28} height={28} />
          </div>
          <span className="font-bold text-lg text-white">studio <span className="font-normal">portal</span></span>
        </div>

        {/* Hero text */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-(--color-sidebar-active) rounded-full px-3 py-1.5 w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-(--color-accent-lime)" />
            <span className="text-xs font-medium text-gray-300">Admin Portal</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
            Manage your<br />
            studio with<br />
            <span className="text-(--color-accent-lime)">confidence.</span>
          </h1>
          <p className="text-sm text-(--color-sidebar-text) leading-relaxed max-w-xs">
            Everything you need to manage clients, projects, payments, and your team — all in one place.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="flex flex-col gap-3">
          {[
            { icon: <Zap size={14} />, text: 'Real-time project tracking' },
            { icon: <Shield size={14} />, text: 'Secure client management' },
            { icon: <Users size={14} />, text: 'Team collaboration tools' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-(--color-sidebar-active) flex items-center justify-center text-(--color-accent-lime) shrink-0">
                {icon}
              </div>
              <span className="text-sm text-(--color-sidebar-text)">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <div className="border border-gray-200 rounded-[14px] flex items-center justify-center w-9 h-9">
            <img src="/assets/logo-white-trans.png" alt="Logo" width={24} height={24} className="invert" />
          </div>
          <span className="font-bold text-base text-(--color-ink)">studio <span className="font-normal">portal</span></span>
        </div>

        <div className="w-full max-w-[380px]">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-(--color-ink) mb-2">Welcome back</h2>
            <p className="text-sm text-gray-500">Sign in to your account to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--color-ink)" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@studio.com"
                className="w-full px-4 py-3 rounded-[14px] bg-(--color-surface-alt) border border-gray-200 text-sm text-(--color-ink) placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-(--color-ink)" htmlFor="password">
                  Password
                </label>
                <button type="button" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-[14px] bg-(--color-surface-alt) border border-gray-200 text-sm text-(--color-ink) placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-[14px] bg-(--color-ink) text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/admin" className="font-medium text-(--color-ink) hover:underline">
                Go to dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SignIn;
