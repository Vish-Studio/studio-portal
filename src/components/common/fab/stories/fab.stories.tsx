import type { Meta, StoryObj } from '@storybook/react';
import Fab from '../fab';

const meta = {
  title: 'Common/Fab',
  component: Fab,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Fab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onClick: () => {}, ariaLabel: 'Add item' },
  decorators: [
    (Story) => (
      <div className="relative w-48 h-48 bg-gray-100 rounded-xl">
        <Story />
      </div>
    ),
  ],
};
