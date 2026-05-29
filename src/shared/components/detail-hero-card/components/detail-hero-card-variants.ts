import type { CSSProperties } from 'react';
import type {
  DetailCardHeroVariant,
  DetailHeroCardSectionVariant,
  DetailHeroCardStatVariant,
} from './detail-hero-card-types';

export const DETAIL_HERO_ICON_STYLE = {
  background: '#ffffff',
  boxShadow: 'none',
} as const;

export const DETAIL_HERO_VARIANTS: Record<DetailCardHeroVariant, string> = {
  ink: 'border-gray-200 bg-white text-(--color-ink) shadow-none',
  flat: 'border-gray-200 bg-white text-(--color-ink) shadow-none',
};

export const DETAIL_SECTION_VARIANTS: Record<DetailHeroCardSectionVariant, string> = {
  default: 'border-gray-200 bg-white shadow-none',
  subtle: 'border-gray-100 bg-[#f7f8fa] shadow-none',
};

const STAT_BASE = {
  background: '#ffffff',
  boxShadow: 'none',
} as const;

export const DETAIL_STAT_VARIANTS: Record<DetailHeroCardStatVariant, CSSProperties> = {
  accent: {
    background: 'linear-gradient(135deg, var(--color-accent-lime) 0%, #ffe15a 100%)',
    borderColor: 'rgba(18, 19, 22, 0.08)',
    boxShadow: 'none',
  },
  positive: {
    background: 'linear-gradient(135deg, #ffffff 0%, #fbfff0 100%)',
    borderColor: 'rgba(224, 250, 114, 0.72)',
    boxShadow: 'none',
  },
  warning: {
    background: 'linear-gradient(135deg, #fffce8 0%, #ffffff 66%, #f8f8f9 100%)',
    borderColor: 'rgba(255, 214, 0, 0.42)',
    boxShadow: 'none',
  },
  neutral: STAT_BASE,
  negative: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f6f7f9 100%)',
    borderColor: 'rgba(18, 19, 22, 0.1)',
    boxShadow: 'none',
  },
};
