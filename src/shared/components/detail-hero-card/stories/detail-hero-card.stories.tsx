import type { Meta, StoryObj } from '@storybook/react';
import { Briefcase, Building2, Mail, Phone, TrendingUp } from '@/src/shared/components/material-icon/material-lucide-icons';
import { DETAIL_COVER_IMAGES } from '../detail-cover-images';
import DetailHeroCard from '../detail-hero-card';

const meta = {
  title: 'Common/Detail Pages/DetailHeroCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'app' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const fakeClientStats = {
  projects: 3,
  activeProjects: 2,
  totalValue: 24500,
  paidValue: 18000,
  balance: 6500,
};

const ClientDetailMock = ({ className = 'w-[1040px] max-w-[calc(100vw-48px)]' }: { className?: string }) => (
  <div className={className}>
    <DetailHeroCard>
      <DetailHeroCard.Hero title="Ikigai Learning" coverImage={DETAIL_COVER_IMAGES.client}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:items-start">
          <div className="min-w-0">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-gray-100 bg-(--color-ink) text-4xl font-black text-white">
              I
            </div>
            <p className="mt-1 max-w-full truncate text-sm font-semibold text-gray-500">Education Technology</p>
            <div className="mt-2.5">
              <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold text-green-700">Active</span>
            </div>
            <p className="mt-3 text-[11px] font-semibold text-gray-400">Client since May 21, 2026</p>
          </div>
          <div className="grid gap-3 pt-6 sm:grid-cols-2 lg:pt-5">
            <DetailHeroCard.IconRow icon={<Mail size={12} />}>
              <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">janesh@ikigai.com</span>
            </DetailHeroCard.IconRow>
            <DetailHeroCard.IconRow icon={<Phone size={12} />}>
              <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">+230 5818 8684</span>
            </DetailHeroCard.IconRow>
            <DetailHeroCard.IconRow icon={<Building2 size={12} />}>
              <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">Port Louis, Mauritius</span>
            </DetailHeroCard.IconRow>
          </div>
        </div>
      </DetailHeroCard.Hero>

      <DetailHeroCard.Stats>
        <DetailHeroCard.Stat
          label="Projects"
          icon={<Briefcase size={12} />}
          value={fakeClientStats.projects}
          sub={`${fakeClientStats.activeProjects} active`}
          trendData={[1, 1, 2, 3, 3]}
          trendVariant="positive"
        />
        <DetailHeroCard.Stat
          label="Total Value"
          icon={<TrendingUp size={12} />}
          value={`$${(fakeClientStats.totalValue / 1000).toFixed(1)}k`}
          sub={`$${fakeClientStats.paidValue.toLocaleString()} paid`}
          valueStyle={{ color: 'var(--color-accent-lime)' }}
          trendData={[4, 9, 13, 18, 24.5]}
          trendVariant="accent"
        />
        <DetailHeroCard.Stat
          label="Balance"
          icon={<TrendingUp size={12} />}
          value={`$${(fakeClientStats.balance / 1000).toFixed(1)}k`}
          sub="outstanding"
          valueClassName="text-amber-500"
          trendData={[12, 10, 8.5, 7.2, 6.5]}
          trendVariant="warning"
        />
      </DetailHeroCard.Stats>
    </DetailHeroCard>
  </div>
);

export const ClientStyle: Story = {
  render: () => <ClientDetailMock />,
};

export const EmptyStats: Story = {
  render: () => (
    <div className="w-[1040px] max-w-[calc(100vw-48px)]">
      <DetailHeroCard>
        <DetailHeroCard.Hero title="New Account" coverImage={DETAIL_COVER_IMAGES.client}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:items-start">
            <div className="min-w-0">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-gray-100 bg-gray-700 text-4xl font-black text-white">
                N
              </div>
              <p className="mt-1 text-sm font-semibold text-gray-500">No projects yet</p>
            </div>
            <DetailHeroCard.IconRow icon={<Mail size={12} />}>
              <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">new@studio.test</span>
            </DetailHeroCard.IconRow>
          </div>
        </DetailHeroCard.Hero>
        <DetailHeroCard.Stats>
          <DetailHeroCard.Stat label="Projects" icon={<Briefcase size={12} />} value={0} sub="none active" trendVariant="neutral" />
          <DetailHeroCard.Stat label="Value" icon={<TrendingUp size={12} />} value="$0" sub="$0 paid" trendVariant="neutral" />
          <DetailHeroCard.Stat label="Balance" icon={<TrendingUp size={12} />} value="Settled" sub="fully paid" trendVariant="positive" />
        </DetailHeroCard.Stats>
      </DetailHeroCard>
    </div>
  ),
};

export const ResponsiveStack: Story = {
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
  render: () => <ClientDetailMock className="w-[720px] max-w-[calc(100vw-48px)]" />,
};
