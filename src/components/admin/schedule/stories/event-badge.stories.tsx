import type { Meta, StoryObj } from '@storybook/react';
import EventBadge from '../event-badge';
import { ALL_EVENT_TYPES } from '../event-types';

const meta = {
  title: 'Admin/Schedule/EventBadge',
  component: EventBadge,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'white' } },
  argTypes: {
    type:    { control: 'select', options: ALL_EVENT_TYPES },
    variant: { control: 'select', options: ['pill', 'compact', 'icon', 'dot'] },
  },
} satisfies Meta<typeof EventBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pill: Story    = { args: { type: 'brief',         variant: 'pill'    } };
export const Compact: Story = { args: { type: 'design-review', variant: 'compact' } };
export const Icon: Story    = { args: { type: 'launch',        variant: 'icon'    } };
export const Dot: Story     = { args: { type: 'revision',      variant: 'dot'     } };

export const AllTypes: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-3">
      {ALL_EVENT_TYPES.map(type => (
        <div key={type} className="flex items-center gap-3">
          <EventBadge type={type} variant="icon" />
          <EventBadge type={type} variant="pill" />
          <EventBadge type={type} variant="compact" />
          <EventBadge type={type} variant="dot" />
        </div>
      ))}
    </div>
  ),
};
