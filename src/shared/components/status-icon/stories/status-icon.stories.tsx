import type { Meta, StoryObj } from '@storybook/react';
import StatusIcon from '../status-icon';

const meta = {
  title: 'Common/StatusIcon',
  component: StatusIcon,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'white' } },
  argTypes: {
    status: { control: 'select', options: ['active', 'inactive', 'pending'] },
  },
} satisfies Meta<typeof StatusIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story   = { args: { status: 'active'   } };
export const Inactive: Story = { args: { status: 'inactive' } };
export const Pending: Story  = { args: { status: 'pending'  } };

export const AllStatuses: StoryObj = {
  render: () => (
    <div className="flex items-center gap-4">
      {(['active', 'inactive', 'pending'] as const).map(status => (
        <div key={status} className="flex items-center gap-2">
          <StatusIcon status={status} />
          <span className="text-sm text-gray-600 capitalize">{status}</span>
        </div>
      ))}
    </div>
  ),
};
