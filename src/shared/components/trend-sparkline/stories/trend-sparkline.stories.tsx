import type { Meta, StoryObj } from '@storybook/react';
import TrendSparkline from '../trend-sparkline';

const sparklineVariants = [
  { label: 'Positive', variant: 'positive' as const, data: [12, 18, 17, 31, 38, 46, 54] },
  { label: 'Negative', variant: 'negative' as const, data: [54, 48, 50, 38, 32, 24, 18] },
  { label: 'Neutral', variant: 'neutral' as const, data: [32, 34, 33, 35, 34, 36, 35] },
  { label: 'Warning', variant: 'warning' as const, data: [18, 42, 26, 48, 34, 58, 40] },
  { label: 'Accent', variant: 'accent' as const, data: [18, 26, 24, 38, 36, 50, 44] },
];

const meta = {
  title: 'Common/Charts/TrendSparkline',
  component: TrendSparkline,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'app' },
  },
  decorators: [
    Story => (
      <div className="rounded-[22px] border border-gray-200 bg-white p-8 shadow-[0_14px_40px_var(--color-shadow-subtle)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TrendSparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Positive: Story = {
  args: {
    variant: 'positive',
    data: [12, 20, 18, 30, 38, 44, 52],
    className: 'h-16 w-40',
  },
};

export const Negative: Story = {
  args: {
    variant: 'negative',
    data: [58, 52, 54, 42, 38, 28, 22],
    className: 'h-16 w-40',
  },
};

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    data: [32, 34, 33, 35, 34, 36, 35],
    className: 'h-16 w-40',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    data: [18, 42, 26, 48, 34, 58, 40],
    className: 'h-16 w-40',
  },
};

export const Accent: Story = {
  args: {
    variant: 'accent',
    data: [18, 26, 24, 38, 36, 50, 44],
    className: 'h-16 w-40',
  },
};

export const AutoVariantFromData: Story = {
  args: {
    data: [18, 24, 31, 38, 42, 50, 56],
    className: 'h-16 w-40',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid gap-5 sm:grid-cols-2">
      {sparklineVariants.map(item => (
        <div key={item.variant} className="rounded-2xl border border-gray-100 bg-white p-4">
          <p className="mb-3 text-xs font-bold text-gray-500">{item.label}</p>
          <TrendSparkline variant={item.variant} data={item.data} className="h-16 w-44" />
        </div>
      ))}
    </div>
  ),
};
