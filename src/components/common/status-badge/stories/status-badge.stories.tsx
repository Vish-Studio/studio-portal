import type { Meta, StoryObj } from '@storybook/react';
import StatusBadge from '../status-badge';

const meta = {
  title: 'Common/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'white' } },
  argTypes: {
    variant: {
      control: 'select',
      options: ['green', 'amber', 'red', 'gray', 'blue', 'purple', 'violet'],
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = { args: { label: 'active', variant: 'green' } };
export const Paused: Story = { args: { label: 'paused', variant: 'amber' } };
export const Overdue: Story = { args: { label: 'overdue', variant: 'red' } };
export const Inactive: Story = { args: { label: 'inactive', variant: 'gray' } };

export const AllVariants: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusBadge label="active"    variant="green"  />
      <StatusBadge label="paused"    variant="amber"  />
      <StatusBadge label="overdue"   variant="red"    />
      <StatusBadge label="inactive"  variant="gray"   />
      <StatusBadge label="in review" variant="blue"   />
      <StatusBadge label="planned"   variant="purple" />
      <StatusBadge label="blocked"   variant="violet" />
    </div>
  ),
};
