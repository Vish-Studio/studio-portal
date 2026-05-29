import type { Meta, StoryObj } from '@storybook/react';
import { DETAIL_COVER_IMAGES, DetailCardHero } from '../../detail-hero-card';

const meta = {
  title: 'Common/Detail Pages/DetailCardHero',
  component: DetailCardHero,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'app' },
  },
  args: {
    children: null,
    variant: 'ink',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['ink', 'flat'],
    },
  },
} satisfies Meta<typeof DetailCardHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ink: Story = {
  render: args => (
    <div className="w-[360px]">
      <DetailCardHero {...args} title="Ikigai Learning" coverImage={DETAIL_COVER_IMAGES.client}>
        <div className="-mt-14 mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-cyan-500 text-4xl font-black text-white">
          I
        </div>
        <p className="mt-1 max-w-full truncate text-sm font-semibold text-gray-500">Education Technology</p>
        <p className="mt-3 text-[11px] font-semibold text-gray-400">Client since May 21, 2026</p>
      </DetailCardHero>
    </div>
  ),
};

export const Flat: Story = {
  args: {
    variant: 'flat',
  },
  render: args => (
    <div className="w-[360px]">
      <DetailCardHero {...args} title="Studio Portal" coverImage={DETAIL_COVER_IMAGES.project}>
        <div className="-mt-14 mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-(--color-accent-lime) text-4xl font-black text-(--color-ink)">
          S
        </div>
        <p className="mt-1 max-w-full truncate text-sm font-medium text-gray-500">Software · Premium</p>
        <p className="mt-3 text-[11px] text-gray-500">Started May 28, 2026</p>
      </DetailCardHero>
    </div>
  ),
};
