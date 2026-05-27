import { FunctionComponent } from 'react';

// ─── Shared style tokens ──────────────────────────────────────────────────────

const DIVIDER = { borderColor: 'rgba(255,255,255,0.08)' } as const;
const STAT_BG  = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.095), rgba(255,255,255,0.035))',
  boxShadow:  'inset 0 1px 0 rgba(255,255,255,0.08)',
} as const;
const ICON_BG  = {
  background: 'rgba(255,255,255,0.08)',
  boxShadow:  'inset 0 1px 0 rgba(255,255,255,0.09)',
} as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Outer dark container. Desktop uses a compact summary rail; mobile stacks sections. */
const Root: FunctionComponent<{ children: React.ReactNode; className?: string }> = ({
  children, className = '',
}) => (
  <div className={`detail-hero-card grid overflow-hidden rounded-[24px] border border-white/8 bg-[radial-gradient(circle_at_16%_0%,rgba(255,214,10,0.14),transparent_30%),linear-gradient(135deg,#111216_0%,#0d1014_56%,#162633_100%)] shadow-[0_18px_54px_rgba(13,16,20,0.15)] md:grid-cols-[minmax(280px,0.9fr)_minmax(280px,1fr)_minmax(320px,1fr)] ${className}`}>
    {children}
  </div>
);

/** Padded hero area — place avatar/icon, name, badges, and date here. */
const Hero: FunctionComponent<{ children: React.ReactNode }> = ({ children }) => (
  <div className="detail-hero-card-hero relative overflow-hidden px-6 py-5 md:flex md:min-h-[154px] md:flex-col md:items-start md:justify-center md:px-7 md:py-5">
    {children}
  </div>
);

/** Decorative lime glow blob — absolute-positioned, place inside Hero. */
const Glow: FunctionComponent<{ className?: string }> = ({ className = '' }) => (
  <div
    aria-hidden="true"
    className={`detail-hero-card-glow pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full opacity-[0.14] blur-2xl ${className}`}
    style={{ background: 'var(--color-accent-lime)' }}
  />
);

/** A horizontal divider section (contact info, meta rows, etc.). */
const Section: FunctionComponent<{ children: React.ReactNode; className?: string }> = ({
  children, className = '',
}) => (
  <div className={`detail-hero-card-section border-t bg-white/[0.025] px-6 py-5 md:flex md:min-h-[154px] md:flex-col md:items-start md:justify-center md:border-l md:border-t-0 md:px-6 ${className}`} style={DIVIDER}>
    {children}
  </div>
);

/** A small pill-shaped icon container — dark glass, for Mail / Phone / Building etc. */
const IconRow: FunctionComponent<{ icon: React.ReactNode; children: React.ReactNode }> = ({
  icon, children,
}) => (
  <div className="detail-hero-card-icon-row flex min-w-0 items-center gap-3">
    <div
      className="detail-hero-card-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-gray-300"
      style={ICON_BG}
    >
      {icon}
    </div>
    {children}
  </div>
);

/** 2-column stats grid section. */
const Stats: FunctionComponent<{ children: React.ReactNode }> = ({ children }) => (
  <div className="detail-hero-card-stats grid grid-cols-1 gap-3 border-t bg-white/[0.018] px-6 py-5 sm:grid-cols-[repeat(auto-fit,minmax(128px,1fr))] md:min-h-[154px] md:items-center md:border-l md:border-t-0 md:px-6" style={DIVIDER}>
    {children}
  </div>
);

/** Individual stat tile. */
const Stat: FunctionComponent<{
  label: string;
  icon?: React.ReactNode;
  value: React.ReactNode;
  sub?: string;
  valueClassName?: string;
  valueStyle?: React.CSSProperties;
}> = ({ label, icon, value, sub, valueClassName = 'text-white', valueStyle }) => (
  <div className="detail-hero-card-stat min-h-[92px] rounded-[16px] border border-white/8 p-3.5" style={STAT_BG}>
    <div className="detail-hero-card-stat-header mb-2.5 flex items-center gap-2">
      {icon && <span className="text-gray-500">{icon}</span>}
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</p>
    </div>
    <p className={`text-2xl font-black leading-none tracking-normal ${valueClassName}`} style={valueStyle}>
      {value}
    </p>
    {sub && <p className="mt-1.5 text-[11px] font-semibold text-gray-500">{sub}</p>}
  </div>
);

/** Bottom footer strip — key/value pair (e.g. "Outstanding balance / $1,200"). */
const Footer: FunctionComponent<{
  label: React.ReactNode;
  value: React.ReactNode;
}> = ({ label, value }) => (
  <div className="detail-hero-card-footer flex items-center justify-between border-t bg-white/[0.025] px-6 py-3.5 md:col-span-3 md:px-8" style={DIVIDER}>
    <span className="text-xs font-semibold text-gray-500">{label}</span>
    {value}
  </div>
);

// ─── Namespace export ─────────────────────────────────────────────────────────

const DetailHeroCard = Object.assign(Root, {
  Hero,
  Glow,
  Section,
  IconRow,
  Stats,
  Stat,
  Footer,
});

export default DetailHeroCard;
