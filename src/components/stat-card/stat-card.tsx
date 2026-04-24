import React from 'react';
import MaterialIcon from '../ui/material-icon';

export type CardVariant = 'lime' | 'surface' | 'dark' | 'white';

interface VariantStyle {
  container: string;
  labelText: string;
  valueText: string;
  badgeBg: string;
  badgeText: string;
  footerText: string;
  actionText: string;
}

const VARIANT_STYLES: Record<CardVariant, VariantStyle> = {
  lime: {
    container: 'bg-(--color-accent-lime)',
    labelText: 'text-gray-800',
    valueText: 'text-(--color-ink)',
    badgeBg: 'bg-white/60',
    badgeText: 'text-gray-900',
    footerText: 'text-gray-700',
    actionText: 'text-gray-400 hover:text-gray-600',
  },
  surface: {
    container: 'bg-(--color-surface-alt)',
    labelText: 'text-gray-600',
    valueText: 'text-(--color-ink)',
    badgeBg: 'bg-white',
    badgeText: 'text-gray-900',
    footerText: 'text-gray-500',
    actionText: 'text-gray-400 hover:text-gray-600',
  },
  dark: {
    container: 'bg-(--color-ink)',
    labelText: 'text-gray-400',
    valueText: 'text-white',
    badgeBg: 'bg-white/10',
    badgeText: 'text-white',
    footerText: 'text-gray-400',
    actionText: 'text-gray-400 hover:text-gray-300',
  },
  white: {
    container: 'bg-white border border-gray-100 shadow-sm',
    labelText: 'text-gray-500',
    valueText: 'text-(--color-ink)',
    badgeBg: 'bg-gray-100',
    badgeText: 'text-gray-700',
    footerText: 'text-gray-400',
    actionText: 'text-gray-400 hover:text-gray-600',
  },
};

export interface StatCardProps {
  variant?: CardVariant;
  /** Lucide or custom icon node shown beside the label */
  icon: React.ReactNode;
  /** Small label text above the value */
  label: string;
  /** Primary big value (string, number, or ReactNode) */
  value: React.ReactNode;
  /** Optional sub-label rendered beside the value, e.g. "/ $5,000" */
  valueSubLabel?: string;
  /** Content rendered inside the bottom badge pill */
  badge?: React.ReactNode;
  /** Text rendered after the badge pill */
  badgeLabel?: string;
  /** Optional callback for the top-right arrow icon */
  onAction?: () => void;
  className?: string;
}

export default function StatCard({
  variant = 'white',
  icon,
  label,
  value,
  valueSubLabel,
  badge,
  badgeLabel,
  onAction,
  className = '',
}: StatCardProps) {
  const s = VARIANT_STYLES[variant];

  return (
    <div
      className={`stat-card ${s.container} rounded-[18px] p-4 md:p-6 flex flex-col items-start gap-4 ${className}`}
    >
      {/* Top row: icon + label | action */}
      <div className="flex w-full justify-between items-center">
        <div className={`flex items-center gap-2 font-medium text-sm ${s.labelText}`}>
          {icon}
          <span>{label}</span>
        </div>
        {onAction && (
          <button onClick={onAction} className={`transition-colors cursor-pointer ${s.actionText}`}>
            <MaterialIcon name="arrow_outward" size={16} />
          </button>
        )}
      </div>

      {/* Value */}
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`text-[32px] md:text-[42px] font-bold tracking-tight leading-none ${s.valueText}`}>
          {value}
        </span>
        {valueSubLabel && (
          <span className={`text-sm font-medium ${s.footerText}`}>{valueSubLabel}</span>
        )}
      </div>

      {/* Bottom badge row */}
      {(badge || badgeLabel) && (
        <div className="flex items-center gap-2 mt-auto">
          {badge && (
            <div
              className={`flex items-center gap-1 text-[12px] font-bold px-2 py-1 rounded-[6px] ${s.badgeBg} ${s.badgeText}`}
            >
              {badge}
            </div>
          )}
          {badgeLabel && (
            <span className={`text-sm font-medium ${s.footerText}`}>{badgeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
