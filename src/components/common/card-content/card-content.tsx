import React, { FunctionComponent } from 'react';
import MaterialIcon from '../material-icon/material-icon';

// ─── Variant system (mirrors stat-card palette) ───────────────────────────────

export type CardContentVariant = 'white' | 'lime' | 'surface' | 'dark';

interface VariantTokens {
  container: string;
  headerText: string;
  divider: string;
}

const VARIANTS: Record<CardContentVariant, VariantTokens> = {
  white: {
    container: 'bg-white border border-gray-200',
    headerText: 'text-(--color-ink)',
    divider: 'border-gray-100',
  },
  lime: {
    container: 'bg-(--color-accent-lime)',
    headerText: 'text-gray-800',
    divider: 'border-black/10',
  },
  surface: {
    container: 'bg-(--color-surface-alt)',
    headerText: 'text-gray-600',
    divider: 'border-gray-300/40',
  },
  dark: {
    container: 'bg-(--color-ink)',
    headerText: 'text-gray-300',
    divider: 'border-white/10',
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface CardContentProps {
  /** Color palette variant — matches the stat-card system. Defaults to "white". */
  variant?: CardContentVariant;
  /** Material Symbol icon name shown beside the title. */
  iconName: string;
  /** Card title displayed in the header. */
  title: string;
  /**
   * Optional right-side slot in the header (nav controls, action buttons, etc.).
   * Render any ReactNode — it sits flush right, aligned with the title.
   */
  action?: React.ReactNode;
  /** Card body content. Fills the remaining height inside the card. */
  children: React.ReactNode;
  /**
   * Extra Tailwind classes applied to the outer container
   * (e.g. column span, explicit height).
   */
  className?: string;
  /**
   * Extra Tailwind classes applied to the body wrapper div.
   * Use to set padding, overflow, flex direction, etc.
   */
  bodyClassName?: string;
}

/**
 * Reusable panel card used by Calendar, ProjectsOverview,
 * DocumentOverview, and any future dashboard-style content panel.
 *
 * Provides:
 *   • Consistent container shell (rounded, border/shadow per variant)
 *   • Standardised header: icon + title left, optional action right
 *   • Thin divider between header and body
 *   • Flex-column body that fills remaining height
 *
 * Callers control body scroll and padding via `bodyClassName`.
 */
const CardContent: FunctionComponent<CardContentProps> = ({
  variant = 'white',
  iconName,
  title,
  action,
  children,
  className = '',
  bodyClassName = '',
}) => {
  const variantStyles = VARIANTS[variant];

  return (
    <div
      className={`card-content ${variantStyles.container} rounded-[18px] overflow-hidden flex flex-col ${className}`}
    >
      {/* ── Header ── */}
      <div className="card-header bg-gray-100 px-4 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4 shrink-0">
        <div className={`type-panel-title flex items-center gap-2 ${variantStyles.headerText}`}>
          <MaterialIcon name={iconName} size={16} />
          <span>{title}</span>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* ── Divider ── */}
      <div className={`border-b ${variantStyles.divider} mx-4 md:mx-6 shrink-0`} />

      {/* ── Body ── */}
      <div className={`flex-1 min-h-0 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
}

export default CardContent;
