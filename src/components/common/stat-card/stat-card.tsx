import React, { FunctionComponent } from 'react';
import MaterialIcon from '../material-icon/material-icon';

export type CardVariant = 'lime' | 'surface' | 'dark' | 'white';

interface VariantStyle {
  container: string;
  hoverContainer: string;
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
    hoverContainer: 'hover:brightness-[0.98]',
    labelText: 'text-gray-800',
    valueText: 'text-(--color-ink)',
    badgeBg: 'bg-white/60',
    badgeText: 'text-gray-900',
    footerText: 'text-gray-700',
    actionText: 'text-gray-500 group-hover:text-gray-700',
  },
  surface: {
    container: 'bg-(--color-surface-alt)',
    hoverContainer: 'hover:bg-gray-100',
    labelText: 'text-gray-600',
    valueText: 'text-(--color-ink)',
    badgeBg: 'bg-white',
    badgeText: 'text-gray-900',
    footerText: 'text-gray-500',
    actionText: 'text-gray-400 group-hover:text-gray-600',
  },
  dark: {
    container: 'bg-(--color-ink)',
    hoverContainer: 'hover:bg-gray-900',
    labelText: 'text-gray-400',
    valueText: 'text-white',
    badgeBg: 'bg-white/10',
    badgeText: 'text-white',
    footerText: 'text-gray-400',
    actionText: 'text-gray-400 group-hover:text-gray-200',
  },
  white: {
    container: 'bg-white border border-gray-200',
    hoverContainer: 'hover:bg-(--color-surface-alt)',
    labelText: 'text-gray-500',
    valueText: 'text-(--color-ink)',
    badgeBg: 'bg-gray-100',
    badgeText: 'text-gray-700',
    footerText: 'text-gray-400',
    actionText: 'text-gray-400 group-hover:text-gray-600',
  },
};

export interface StatCardProps {
  variant?: CardVariant;
  size?: 'sm' | 'md';
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

const StatCard: FunctionComponent<StatCardProps> = ({
  variant = 'white',
  size = 'md',
  icon,
  label,
  value,
  valueSubLabel,
  badge,
  badgeLabel,
  onAction,
  className = '',
}) => {
  const s = VARIANT_STYLES[variant];
  const sizeClassName = size === 'sm'
    ? 'min-h-[116px] rounded-[16px] p-4 gap-3'
    : 'rounded-[18px] p-4 md:p-6 gap-4';
  const valueClassName = size === 'sm' ? 'text-3xl' : '';
  const baseClassName = `stat-card ${s.container} ${sizeClassName} flex flex-col items-start transition-all duration-200 ${className}`;
  const clickableClassName = onAction
    ? `group w-full text-left cursor-pointer focus:outline-none focus:ring-4 focus:ring-gray-100 ${s.hoverContainer}`
    : '';

  const content = (
    <>
      {/* Top row: icon + label | action */}
      <div className="flex w-full justify-between items-center">
        <div className={`type-stat-label flex items-center gap-2 ${s.labelText}`}>
          {icon}
          <span>{label}</span>
        </div>
        {onAction && (
          <MaterialIcon
            name="arrow_forward"
            size={18}
            className={`shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${s.actionText}`}
          />
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className={`type-stat-value ${valueClassName} ${s.valueText}`}>
          {value}
        </span>
        {valueSubLabel && (
          <span className={`type-label ${s.footerText}`}>{valueSubLabel}</span>
        )}
      </div>

      {/* Bottom badge row */}
      {(badge || badgeLabel) && (
        <div className="flex items-center gap-2 mt-auto">
          {badge && (
            <div
              className={`type-label flex items-center gap-1 px-2 py-1 rounded-[6px] ${s.badgeBg} ${s.badgeText}`}
            >
              {badge}
            </div>
          )}
          {badgeLabel && (
            <span className={`type-label ${s.footerText}`}>{badgeLabel}</span>
          )}
        </div>
      )}
    </>
  );

  if (onAction) {
    return (
      <button
        type="button"
        onClick={onAction}
        className={`${baseClassName} ${clickableClassName}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={baseClassName}>
      {content}
    </div>
  );
}


export default StatCard;
