import type { FunctionComponent } from 'react';
import type { DetailHeroCardHeroProps } from './detail-hero-card-types';
import { DETAIL_HERO_VARIANTS } from './detail-hero-card-variants';

const DetailHeroCardHero: FunctionComponent<DetailHeroCardHeroProps> = ({
  children,
  className = '',
  variant = 'ink',
}) => (
  <div
    className={`detail-hero-card-hero relative min-w-0 overflow-hidden rounded-[18px] border px-5 py-6 sm:px-7 xl:col-span-3 xl:flex xl:min-h-[220px] xl:flex-col xl:items-start xl:justify-center ${DETAIL_HERO_VARIANTS[variant]} ${className}`}
  >
    {children}
  </div>
);

export default DetailHeroCardHero;
