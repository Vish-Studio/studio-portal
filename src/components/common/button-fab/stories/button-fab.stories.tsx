import type { Meta, StoryObj } from '@storybook/react';
import ButtonFab from '../button-fab';

const meta = {
  title: 'Common/Button/ButtonFab',
  component: ButtonFab,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ButtonFab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onClick: () => { }, ariaLabel: 'Add item' },
  decorators: [
    (Story) => (
      <div className="relative w-48 h-48 bg-gray-100 rounded-xl">
        <Story />

        <ButtonFab onClick={() => { }} ariaLabel='' />
      </div>
    ),
  ],
};
