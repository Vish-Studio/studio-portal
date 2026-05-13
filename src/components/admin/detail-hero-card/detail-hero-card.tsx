import { FunctionComponent } from 'react';

// ─── Shared style tokens ──────────────────────────────────────────────────────

const DIVIDER = { borderColor: 'rgba(255,255,255,0.07)' } as const;
const STAT_BG  = { background:  'rgba(255,255,255,0.05)' } as const;
const ICON_BG  = { background:  'rgba(255,255,255,0.07)' } as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Outer dark container — always rounded-[28px] + overflow-hidden. */
const Root: FunctionComponent<{ children: React.ReactNode; className?: string }> = ({
  children, className = '',
}) => (
  <div className={`detail-hero-card bg-(--color-ink) rounded-[28px] overflow-hidden ${className}`}>
    {children}
  </div>
);

/** Padded hero area — place avatar/icon, name, badges, and date here. */
const Hero: FunctionComponent<{ children: React.ReactNode }> = ({ children }) => (
  <div className="detail-hero-card-hero relative px-6 pt-7 pb-6 overflow-hidden">
    {children}
  </div>
);

/** Decorative lime glow blob — absolute-positioned, place inside Hero. */
const Glow: FunctionComponent<{ className?: string }> = ({ className = '' }) => (
  <div
    aria-hidden="true"
    className={`detail-hero-card-glow absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-10 pointer-events-none ${className}`}
    style={{ background: 'var(--color-accent-lime)' }}
  />
);

/** A horizontal divider section (contact info, meta rows, etc.). */
const Section: FunctionComponent<{ children: React.ReactNode; className?: string }> = ({
  children, className = '',
}) => (
  <div className={`detail-hero-card-section border-t px-6 py-4 ${className}`} style={DIVIDER}>
    {children}
  </div>
);

/** A small pill-shaped icon container — dark glass, for Mail / Phone / Building etc. */
const IconRow: FunctionComponent<{ icon: React.ReactNode; children: React.ReactNode }> = ({
  icon, children,
}) => (
  <div className="detail-hero-card-icon-row flex items-center gap-3">
    <div
      className="detail-hero-card-icon w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
      style={ICON_BG}
    >
      {icon}
    </div>
    {children}
  </div>
);

/** 2-column stats grid section. */
const Stats: FunctionComponent<{ children: React.ReactNode }> = ({ children }) => (
  <div className="detail-hero-card-stats border-t px-6 py-4 grid grid-cols-2 gap-3" style={DIVIDER}>
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
  <div className="detail-hero-card-stat rounded-[16px] p-3.5" style={STAT_BG}>
    <div className="detail-hero-card-stat-header flex items-center gap-1.5 mb-1.5">
      {icon && <span className="text-gray-500">{icon}</span>}
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</p>
    </div>
    <p className={`text-2xl font-black leading-none ${valueClassName}`} style={valueStyle}>
      {value}
    </p>
    {sub && <p className="text-[10px] text-gray-500 mt-1">{sub}</p>}
  </div>
);

/** Bottom footer strip — key/value pair (e.g. "Outstanding balance / $1,200"). */
const Footer: FunctionComponent<{
  label: React.ReactNode;
  value: React.ReactNode;
}> = ({ label, value }) => (
  <div className="detail-hero-card-footer border-t px-6 py-3.5 flex items-center justify-between" style={DIVIDER}>
    <span className="text-xs text-gray-500">{label}</span>
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
