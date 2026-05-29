import type { CSSProperties, FunctionComponent } from 'react';
import TrendSparkline from '../../trend-sparkline/trend-sparkline';
import type { DetailHeroCardStatProps } from './detail-hero-card-types';
import { DETAIL_STAT_VARIANTS } from './detail-hero-card-variants';

const DetailHeroCardStat: FunctionComponent<DetailHeroCardStatProps> = ({
  label,
  icon,
  value,
  sub,
  valueClassName = 'text-white',
  valueStyle,
  trendData,
  trendVariant = 'neutral',
  className = '',
}) => {
  const isAccentStat = trendVariant === 'accent';

  return (
    <div
      className={`detail-hero-card-stat relative min-h-[112px] min-w-0 overflow-hidden rounded-[18px] border border-gray-200 p-5 sm:pr-20 xl:min-h-[68px] xl:p-4 xl:pr-24 ${className}`}
      style={DETAIL_STAT_VARIANTS[trendVariant]}
    >
      <div className="detail-hero-card-stat-header mb-3 flex items-center gap-3 xl:mb-2">
        {icon && (
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[15px] ${isAccentStat ? 'bg-white/40 text-(--color-ink)' : 'bg-[#f2f3f5] text-gray-500'}`}>
            {icon}
          </span>
        )}
        <p className={`truncate text-xs font-bold ${isAccentStat ? 'text-(--color-ink)' : 'text-gray-500'}`}>
          {label}
        </p>
      </div>
      <p
        className={`truncate text-[30px] font-black leading-none tracking-normal xl:text-[26px] ${valueClassName === 'text-white' || isAccentStat ? 'text-(--color-ink)' : valueClassName}`}
        style={isAccentStat ? undefined : valueStyle}
      >
        {value}
      </p>
      {sub && (
        <p className={`mt-1.5 truncate text-xs font-semibold ${isAccentStat ? 'text-(--color-ink)/70' : 'text-gray-400'}`}>
          {sub}
        </p>
      )}
      <TrendSparkline
        data={trendData}
        variant={trendVariant}
        className={`pointer-events-none absolute bottom-4 right-4 hidden h-10 w-24 sm:block ${isAccentStat ? 'opacity-70' : 'opacity-90'}`}
        style={isAccentStat ? { '--trend-sparkline-color': 'var(--color-ink)' } as CSSProperties : undefined}
      />
    </div>
  );
};

export default DetailHeroCardStat;
