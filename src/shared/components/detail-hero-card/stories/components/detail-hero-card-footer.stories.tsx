import type { Meta, StoryObj } from '@storybook/react';
import { DetailHeroCardFooter } from '../../detail-hero-card';

const meta = {
  title: 'Common/Detail Pages/DetailHeroCard/Footer',
  component: DetailHeroCardFooter,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'app' },
  },
  args: {
    label: 'Outstanding balance',
    value: <span className="text-sm font-black text-(--color-ink)">$6,500</span>,
  },
} satisfies Meta<typeof DetailHeroCardFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <div className="w-[640px] max-w-[calc(100vw-48px)]">
      <DetailHeroCardFooter {...args} />
    </div>
  ),
};
