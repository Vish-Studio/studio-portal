import type { FunctionComponent } from 'react';
import type { DetailHeroCardRootProps } from './detail-hero-card-types';

const DetailHeroCardRoot: FunctionComponent<DetailHeroCardRootProps> = ({
  children,
  className = '',
}) => (
  <div className={`detail-hero-card grid w-full max-w-full min-w-0 gap-3 sm:gap-4 xl:grid-cols-12 ${className}`}>
    {children}
  </div>
);

export default DetailHeroCardRoot;
