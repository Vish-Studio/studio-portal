import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, RefreshCw } from 'lucide-react';

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
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#0c0d0f' }}
    >
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Lime glow — top right */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-80px', right: '-80px',
          width: '420px', height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,214,0,0.12) 0%, transparent 65%)',
        }}
      />

      {/* Soft purple glow — bottom left */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-100px', left: '-60px',
          width: '380px', height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)',
        }}
      />

      {/* Floating pill labels — decorative */}
      <span className="absolute top-8 left-8 hidden sm:inline-flex items-center gap-2 text-[11px] font-semibold text-white/20 tracking-widest uppercase select-none">
        <span className="w-8 h-px bg-white/15 inline-block" />
        Studio Portal
      </span>
      <span className="absolute bottom-8 right-8 hidden sm:inline-flex items-center gap-2 text-[11px] font-semibold text-white/20 tracking-widest uppercase select-none">
        v2.0
        <span className="w-8 h-px bg-white/15 inline-block" />
      </span>

      {/* Card */}
      <div className="relative w-full max-w-100 mx-4 sm:mx-auto">

        {/* Top bar accent */}
        <div
          className="h-1 w-16 rounded-full mb-6 mx-auto"
          style={{ background: 'var(--color-accent-lime)' }}
        />

        {/* Dark header section */}
        <div
          className="rounded-t-[28px] px-8 pt-8 pb-7 border border-b-0"
          style={{
            background: '#161719',
            borderColor: 'rgba(255,255,255,0.07)',
          }}
        >
          {/* Logo row */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-[14px]"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <img src="/assets/logo-white-trans.png" alt="Logo" width={22} height={22} />
            </div>
            <span className="font-bold text-sm text-white/90 tracking-tight">
              studio <span className="font-normal text-white/50">portal</span>
            </span>
          </div>

          <h1 className="text-[28px] font-bold text-white leading-tight tracking-tight">
            Welcome back.
          </h1>
          <p className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Sign in to manage your studio workspace.
          </p>
        </div>

        {/* Light form section */}
        <div
          className="rounded-b-[28px] px-8 py-7 border border-t-0"
          style={{
            background: '#f7f8fa',
            borderColor: 'rgba(255,255,255,0.07)',
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@studio.com"
                className="w-full px-4 py-3 rounded-[14px] bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"
                >
                  Forgot?
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
                  className="w-full px-4 py-3 pr-11 rounded-[14px] bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-[14px] text-sm font-bold tracking-tight transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-accent-lime)', color: '#111' }}
            >
              {isLoading ? (
                <RefreshCw size={15} className="animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={15} />
                </>
              )}
            </button>

          </form>

          {/* Footer */}
          <p className="mt-5 text-center text-[12px] text-gray-400">
            Don't have an account?{' '}
            <Link to="/admin" className="font-semibold text-gray-700 hover:underline">
              Go to dashboard
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignIn;
