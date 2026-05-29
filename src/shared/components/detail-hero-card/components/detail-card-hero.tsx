import type { FunctionComponent } from 'react';
import type { DetailCardHeroProps } from './detail-hero-card-types';
import { DETAIL_HERO_VARIANTS } from './detail-hero-card-variants';

const DetailCardHero: FunctionComponent<DetailCardHeroProps> = ({
  children,
  className = '',
  coverImage,
  title,
  variant = 'ink',
}) => (
  <div
    className={`detail-card-hero min-w-0 overflow-hidden rounded-[22px] border xl:col-span-12 ${DETAIL_HERO_VARIANTS[variant]} ${className}`}
  >
    <div className="detail-card-hero-cover relative flex min-h-56 items-center justify-center overflow-hidden bg-(--color-ink) px-5 py-6 sm:min-h-64 sm:px-7">
      {coverImage && (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-35 grayscale"
          style={{ backgroundImage: `url(${coverImage})` }}
        />
      )}
      <div aria-hidden className="absolute inset-0 bg-(--color-ink) opacity-[0.88]" />
      {title && (
        <h2 className="relative z-10 max-w-full truncate text-center text-[30px] font-black leading-tight text-white sm:text-[38px]">
          {title}
        </h2>
      )}
    </div>
    <div className="detail-card-hero-body relative z-10 overflow-visible px-5 pb-6 sm:px-7">
      {children}
    </div>
  </div>
);

export default DetailCardHero;
