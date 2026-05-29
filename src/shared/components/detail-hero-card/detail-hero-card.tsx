import DetailHeroCardRoot from './components/detail-hero-card-root';
import DetailHeroCardHero from './components/detail-hero-card-hero';
import DetailHeroCardSection from './components/detail-hero-card-section';
import DetailHeroCardIconRow from './components/detail-hero-card-icon-row';
import DetailHeroCardStats from './components/detail-hero-card-stats';
import DetailHeroCardStat from './components/detail-hero-card-stat';
import DetailHeroCardFooter from './components/detail-hero-card-footer';

const DetailHeroCard = Object.assign(DetailHeroCardRoot, {
  Hero: DetailHeroCardHero,
  Section: DetailHeroCardSection,
  IconRow: DetailHeroCardIconRow,
  Stats: DetailHeroCardStats,
  Stat: DetailHeroCardStat,
  Footer: DetailHeroCardFooter,
});

export {
  DetailHeroCardRoot,
  DetailHeroCardHero,
  DetailHeroCardSection,
  DetailHeroCardIconRow,
  DetailHeroCardStats,
  DetailHeroCardStat,
  DetailHeroCardFooter,
};

export type {
  DetailHeroCardFooterProps,
  DetailHeroCardHeroProps,
  DetailHeroCardHeroVariant,
  DetailHeroCardIconRowProps,
  DetailHeroCardRootProps,
  DetailHeroCardSectionProps,
  DetailHeroCardSectionVariant,
  DetailHeroCardStatProps,
  DetailHeroCardStatVariant,
  DetailHeroCardStatsProps,
} from './components/detail-hero-card-types';

export default DetailHeroCard;
