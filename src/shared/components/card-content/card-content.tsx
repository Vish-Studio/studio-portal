import React, { FunctionComponent } from 'react';
import MaterialIcon from '../material-icon/material-icon';

// ─── Variant system (mirrors stat-card palette) ───────────────────────────────

export type CardContentVariant = 'white' | 'lime' | 'surface' | 'dark';

interface VariantTokens {
  container: string;
  headerText: string;
  iconFrame: string;
  divider: string;
}

const VARIANTS: Record<CardContentVariant, VariantTokens> = {
  white: {
    container: 'bg-white border border-gray-200/80 shadow-[0_18px_50px_var(--color-shadow-subtle)]',
    headerText: 'text-(--color-ink)',
    iconFrame: 'bg-(--color-surface-alt) text-(--color-ink)',
    divider: 'border-gray-100/80',
  },
  lime: {
    container: 'bg-(--color-accent-lime) shadow-[0_18px_50px_var(--color-shadow-subtle)]',
    headerText: 'text-gray-800',
    iconFrame: 'bg-white/60 text-(--color-ink)',
    divider: 'border-black/10',
  },
  surface: {
    container: 'bg-(--color-surface-alt) border border-gray-200/70 shadow-[0_18px_50px_var(--color-shadow-subtle)]',
    headerText: 'text-gray-600',
    iconFrame: 'bg-white text-(--color-ink)',
    divider: 'border-gray-200/70',
  },
  dark: {
    container: 'bg-(--color-ink) shadow-[0_18px_50px_var(--color-shadow-subtle)]',
    headerText: 'text-gray-300',
    iconFrame: 'bg-white/10 text-white',
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
      <div className="card-header px-4 py-4 md:px-5 md:py-5 flex items-center justify-between gap-4 shrink-0">
        <div className={`type-panel-title flex items-center gap-2 ${variantStyles.headerText}`}>
          <span className={`flex h-7 w-7 items-center justify-center rounded-[10px] ${variantStyles.iconFrame}`}>
            <MaterialIcon name={iconName} size={15} />
          </span>
          <span>{title}</span>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className={`border-b ${variantStyles.divider} mx-4 md:mx-5 shrink-0`} />

      <div className={`flex-1 min-h-0 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
}

export default CardContent;
