import type { Meta, StoryObj } from '@storybook/react';
import { Briefcase, CheckSquare, TrendingUp, Users } from '@/src/shared/components/material-icon/material-lucide-icons';
import { DetailHeroCardStat, DetailHeroCardStats } from '../../detail-hero-card';

const meta = {
  title: 'Common/Detail Pages/DetailHeroCard/Stat',
  component: DetailHeroCardStat,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'app' },
  },
  args: {
    label: 'Projects',
    icon: <Briefcase size={12} />,
    value: 3,
    sub: '2 active',
    trendData: [1, 2, 2, 3, 3],
    trendVariant: 'positive',
  },
  argTypes: {
    trendVariant: {
      control: 'select',
      options: ['positive', 'negative', 'neutral', 'warning', 'accent'],
    },
  },
} satisfies Meta<typeof DetailHeroCardStat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: args => (
    <div className="w-[340px]">
      <DetailHeroCardStat {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="w-[920px] max-w-[calc(100vw-48px)]">
      <DetailHeroCardStats className="xl:grid-cols-3">
        <DetailHeroCardStat
          label="Tasks"
          icon={<CheckSquare size={12} />}
          value={12}
          sub="4 open"
          trendData={[2, 5, 4, 8, 12]}
          trendVariant="warning"
        />
        <DetailHeroCardStat
          label="Team"
          icon={<Users size={12} />}
          value={5}
          sub="assigned"
          trendData={[1, 2, 3, 4, 5]}
          trendVariant="positive"
        />
        <DetailHeroCardStat
          label="Value"
          icon={<TrendingUp size={12} />}
          value="$24.5k"
          sub="$18k paid"
          trendData={[4, 9, 13, 18, 24.5]}
          trendVariant="accent"
        />
      </DetailHeroCardStats>
    </div>
  ),
};

export const Neutral: Story = {
  args: {
    label: 'No activity',
    value: 0,
    sub: 'nothing open',
    trendVariant: 'neutral',
    trendData: [1, 1, 1, 1, 1],
  },
};
