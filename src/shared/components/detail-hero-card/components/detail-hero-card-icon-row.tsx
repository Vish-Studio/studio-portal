import type { FunctionComponent } from 'react';
import type { DetailHeroCardIconRowProps } from './detail-hero-card-types';
import { DETAIL_HERO_ICON_STYLE } from './detail-hero-card-variants';

const DetailHeroCardIconRow: FunctionComponent<DetailHeroCardIconRowProps> = ({
  icon,
  children,
  className = '',
}) => (
  <div className={`detail-hero-card-icon-row flex min-w-0 max-w-full items-center gap-3 rounded-[16px] border border-gray-100 bg-[#f7f8fa] px-3 py-2.5 ${className}`}>
    <div
      className="detail-hero-card-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-[13px] text-gray-500"
      style={DETAIL_HERO_ICON_STYLE}
    >
      {icon}
    </div>
    {children}
  </div>
);

export default DetailHeroCardIconRow;
