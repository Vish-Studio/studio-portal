import type { CSSProperties, ReactNode } from 'react';
import type { TrendSparklineVariant } from '../../trend-sparkline/trend-sparkline';

export type DetailHeroCardHeroVariant = 'ink' | 'flat';
export type DetailHeroCardSectionVariant = 'default' | 'subtle';
export type DetailHeroCardStatVariant = TrendSparklineVariant;

export interface DetailHeroCardRootProps {
  children: ReactNode;
  className?: string;
}

export interface DetailHeroCardHeroProps {
  children: ReactNode;
  className?: string;
  variant?: DetailHeroCardHeroVariant;
}

export interface DetailHeroCardSectionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
  variant?: DetailHeroCardSectionVariant;
}

export interface DetailHeroCardIconRowProps {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export interface DetailHeroCardStatsProps {
  children: ReactNode;
  className?: string;
}

export interface DetailHeroCardStatProps {
  label: string;
  icon?: ReactNode;
  value: ReactNode;
  sub?: string;
  valueClassName?: string;
  valueStyle?: CSSProperties;
  trendData?: number[];
  trendVariant?: DetailHeroCardStatVariant;
  className?: string;
}

export interface DetailHeroCardFooterProps {
  label: ReactNode;
  value: ReactNode;
  className?: string;
}
