import type { Meta, StoryObj } from '@storybook/react';
import { DetailHeroCardHero } from '../../detail-hero-card';

const meta = {
  title: 'Common/Detail Pages/DetailHeroCard/Hero',
  component: DetailHeroCardHero,
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
} satisfies Meta<typeof DetailHeroCardHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ink: Story = {
  render: args => (
    <div className="w-[360px]">
      <DetailHeroCardHero {...args}>
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] bg-cyan-500 text-2xl font-black text-white">
          I
        </div>
        <h2 className="max-w-full truncate text-[26px] font-black leading-tight text-white">Ikigai Learning</h2>
        <p className="mt-1 max-w-full truncate text-sm font-medium text-gray-400">Education Technology</p>
        <p className="mt-3 text-[11px] text-gray-600">Client since May 21, 2026</p>
      </DetailHeroCardHero>
    </div>
  ),
};

export const Flat: Story = {
  args: {
    variant: 'flat',
  },
  render: args => (
    <div className="w-[360px]">
      <DetailHeroCardHero {...args}>
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] bg-(--color-accent-lime) text-2xl font-black text-(--color-ink)">
          S
        </div>
        <h2 className="max-w-full truncate text-[26px] font-black leading-tight text-(--color-ink)">Studio Portal</h2>
        <p className="mt-1 max-w-full truncate text-sm font-medium text-gray-500">Software · Premium</p>
        <p className="mt-3 text-[11px] text-gray-500">Started May 28, 2026</p>
      </DetailHeroCardHero>
    </div>
  ),
};
