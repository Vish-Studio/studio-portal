import { FunctionComponent } from 'react';
import TrendSparkline, { type TrendSparklineVariant } from '../trend-sparkline/trend-sparkline';

// ─── Shared style tokens ──────────────────────────────────────────────────────

const STAT_BG  = {
  background: '#ffffff',
  boxShadow:  '0 18px 50px rgba(15, 23, 42, 0.055)',
} as const;
const ICON_BG  = {
  background: 'rgba(18, 19, 22, 0.04)',
  boxShadow:  'none',
} as const;

const STAT_VARIANT_STYLE: Record<TrendSparklineVariant, React.CSSProperties> = {
  accent: {
    background: 'linear-gradient(135deg, var(--color-accent-lime) 0%, #ffe15a 100%)',
    borderColor: 'rgba(18, 19, 22, 0.08)',
    boxShadow: '0 22px 56px rgba(255, 214, 0, 0.18)',
  },
  positive: {
    background: 'linear-gradient(135deg, #ffffff 0%, #fbfff0 100%)',
    borderColor: 'rgba(224, 250, 114, 0.72)',
    boxShadow: '0 18px 46px rgba(224, 250, 114, 0.13)',
  },
  warning: {
    background: 'linear-gradient(135deg, #fffce8 0%, #ffffff 66%, #f8f8f9 100%)',
    borderColor: 'rgba(255, 214, 0, 0.42)',
    boxShadow: '0 18px 46px rgba(255, 214, 0, 0.11)',
  },
  neutral: STAT_BG,
  negative: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f6f7f9 100%)',
    borderColor: 'rgba(18, 19, 22, 0.1)',
    boxShadow: '0 18px 46px var(--color-shadow-subtle)',
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Outer dark container. Mobile/tablet stacks; larger screens progressively split content. */
const Root: FunctionComponent<{ children: React.ReactNode; className?: string }> = ({
  children, className = '',
}) => (
  <div className={`detail-hero-card grid w-full max-w-full min-w-0 gap-3 sm:gap-4 xl:grid-cols-12 ${className}`}>
    {children}
  </div>
);

/** Padded hero area — place avatar/icon, name, badges, and date here. */
const Hero: FunctionComponent<{ children: React.ReactNode }> = ({ children }) => (
  <div className="detail-hero-card-hero relative min-w-0 overflow-hidden rounded-[18px] border border-white/10 bg-[radial-gradient(circle_at_18%_0%,rgba(224,250,114,0.14),transparent_30%),radial-gradient(circle_at_110%_105%,rgba(49,80,101,0.48),transparent_38%),linear-gradient(135deg,#111216_0%,#0b0d10_58%,#16232d_100%)] px-5 py-6 shadow-[0_24px_70px_rgba(13,16,20,0.16)] sm:px-7 xl:col-span-4 xl:flex xl:min-h-[292px] xl:flex-col xl:items-start xl:justify-end">
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
const Section: FunctionComponent<{ children: React.ReactNode; className?: string; title?: string; icon?: React.ReactNode }> = ({
  children, className = '', title, icon,
}) => (
  <div className={`detail-hero-card-section min-w-0 rounded-[18px] border border-gray-200 bg-white px-5 py-5 shadow-[0_18px_52px_rgba(15,23,42,0.055)] sm:px-6 xl:col-span-5 xl:min-h-[292px] ${className}`}>
    {title && (
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {icon && <span className="text-(--color-ink)">{icon}</span>}
          <h3 className="truncate text-sm font-black text-(--color-ink)">{title}</h3>
        </div>
      </div>
    )}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
      {children}
    </div>
  </div>
);

/** A small pill-shaped icon container — dark glass, for Mail / Phone / Building etc. */
const IconRow: FunctionComponent<{ icon: React.ReactNode; children: React.ReactNode }> = ({
  icon, children,
}) => (
  <div className="detail-hero-card-icon-row flex min-w-0 max-w-full items-center gap-3 rounded-[18px] px-3.5 py-3.5 pl-0">
    <div
      className="detail-hero-card-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-[13px] text-gray-500"
      style={ICON_BG}
    >
      {icon}
    </div>
    {children}
  </div>
);

/** 2-column stats grid section. */
const Stats: FunctionComponent<{ children: React.ReactNode }> = ({ children }) => (
  <div className="detail-hero-card-stats grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 xl:col-span-3 xl:grid-cols-1">
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
  trendData?: number[];
  trendVariant?: TrendSparklineVariant;
}> = ({ label, icon, value, sub, valueClassName = 'text-white', valueStyle, trendData, trendVariant }) => {
  const resolvedTrendVariant = trendVariant ?? 'neutral';
  const isAccentStat = resolvedTrendVariant === 'accent';

  return (
  <div
    className="detail-hero-card-stat relative min-h-[122px] min-w-0 overflow-hidden rounded-[18px] border border-gray-200 p-5 sm:pr-20 xl:min-h-[88px] xl:p-4 xl:pr-24"
    style={STAT_VARIANT_STYLE[resolvedTrendVariant]}
  >
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -right-10 -top-14 h-32 w-32 rounded-full blur-2xl ${isAccentStat ? 'bg-white/30' : 'bg-(--color-accent-lime)/16'}`}
    />
    <div className="detail-hero-card-stat-header mb-3 flex items-center gap-3 xl:mb-2">
      {icon && <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[15px] ${isAccentStat ? 'bg-white/40 text-(--color-ink)' : 'bg-[#f2f3f5] text-gray-500'}`}>{icon}</span>}
      <p className={`truncate text-xs font-bold ${isAccentStat ? 'text-(--color-ink)' : 'text-gray-500'}`}>{label}</p>
    </div>
    <p className={`truncate text-[30px] font-black leading-none tracking-normal xl:text-[26px] ${valueClassName === 'text-white' || isAccentStat ? 'text-(--color-ink)' : valueClassName}`} style={isAccentStat ? undefined : valueStyle}>
      {value}
    </p>
    {sub && <p className={`mt-2 truncate text-xs font-semibold ${isAccentStat ? 'text-(--color-ink)/70' : 'text-gray-400'}`}>{sub}</p>}
    <TrendSparkline
      data={trendData}
      variant={resolvedTrendVariant}
      className={`pointer-events-none absolute bottom-4 right-4 hidden h-10 w-24 sm:block ${isAccentStat ? 'opacity-70' : 'opacity-90'}`}
      style={isAccentStat ? { '--trend-sparkline-color': 'var(--color-ink)' } as React.CSSProperties : undefined}
    />
  </div>
  );
};

/** Bottom footer strip — key/value pair (e.g. "Outstanding balance / $1,200"). */
const Footer: FunctionComponent<{
  label: React.ReactNode;
  value: React.ReactNode;
}> = ({ label, value }) => (
  <div className="detail-hero-card-footer flex items-center justify-between rounded-[22px] border border-gray-200 bg-white px-5 py-3.5 shadow-[0_18px_52px_rgba(15,23,42,0.055)] sm:px-6 xl:col-span-12 xl:px-8">
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
