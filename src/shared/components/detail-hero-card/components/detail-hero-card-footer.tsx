import type { FunctionComponent } from 'react';
import type { DetailHeroCardFooterProps } from './detail-hero-card-types';

const DetailHeroCardFooter: FunctionComponent<DetailHeroCardFooterProps> = ({
  label,
  value,
  className = '',
}) => (
  <div className={`detail-hero-card-footer flex items-center justify-between rounded-[22px] border border-gray-200 bg-white px-5 py-3.5 shadow-[0_18px_52px_rgba(15,23,42,0.055)] sm:px-6 xl:col-span-12 xl:px-8 ${className}`}>
    <span className="text-xs font-semibold text-gray-500">{label}</span>
    {value}
  </div>
);

export default DetailHeroCardFooter;
