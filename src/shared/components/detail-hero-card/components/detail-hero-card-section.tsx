import type { FunctionComponent } from 'react';
import type { DetailHeroCardSectionProps } from './detail-hero-card-types';
import { DETAIL_SECTION_VARIANTS } from './detail-hero-card-variants';

const DetailHeroCardSection: FunctionComponent<DetailHeroCardSectionProps> = ({
  children,
  className = '',
  title,
  icon,
  variant = 'default',
}) => (
  <div className={`detail-hero-card-section min-w-0 rounded-[18px] border px-5 py-5 sm:px-6 xl:col-span-6 xl:min-h-[220px] ${DETAIL_SECTION_VARIANTS[variant]} ${className}`}>
    {title && (
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {icon && <span className="text-(--color-ink)">{icon}</span>}
          <h3 className="truncate text-sm font-black text-(--color-ink)">{title}</h3>
        </div>
      </div>
    )}
    <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {children}
    </div>
  </div>
);

export default DetailHeroCardSection;
