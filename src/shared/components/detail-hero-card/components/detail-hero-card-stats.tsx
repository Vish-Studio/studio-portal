import type { FunctionComponent } from 'react';
import type { DetailHeroCardStatsProps } from './detail-hero-card-types';

const DetailHeroCardStats: FunctionComponent<DetailHeroCardStatsProps> = ({
  children,
  className = '',
}) => (
  <div className={`detail-hero-card-stats grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 xl:col-span-12 ${className}`}>
    {children}
  </div>
);

export default DetailHeroCardStats;
