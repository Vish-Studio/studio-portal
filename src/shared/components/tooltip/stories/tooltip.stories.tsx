import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from '../tooltip';

const meta = {
  title: 'Common/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'white' } },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

const Btn = ({ label }: { label: string }) => (
  <button className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl">
    {label}
  </button>
);

export const Top: Story = {
  args: {
    content: 'Tooltip on top',
    side: 'top',
    children: <Btn label="Hover me" />,
  },
  decorators: [Story => <div className="p-16"><Story /></div>],
};

export const Bottom: Story = {
  args: {
    content: 'Tooltip on bottom',
    side: 'bottom',
    children: <Btn label="Hover me" />,
  },
  decorators: [Story => <div className="p-16"><Story /></div>],
};

export const Left: Story = {
  args: {
    content: 'Tooltip on left',
    side: 'left',
    children: <Btn label="Hover me" />,
  },
  decorators: [Story => <div className="p-16"><Story /></div>],
};

export const Right: Story = {
  args: {
    content: 'Tooltip on right',
    side: 'right',
    children: <Btn label="Hover me" />,
  },
  decorators: [Story => <div className="p-16"><Story /></div>],
};

export const AllSides: StoryObj = {
  render: () => (
    <div className="grid grid-cols-2 gap-12 p-16">
      {(['top', 'bottom', 'left', 'right'] as const).map(side => (
        <div key={side} className="flex items-center justify-center">
          <Tooltip content={`Side: ${side}`} side={side}>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200">
              {side}
            </button>
          </Tooltip>
        </div>
      ))}
    </div>
  ),
};
