import type { Meta, StoryObj } from '@storybook/react';
import StatusBadge, { ClientStatusBadge, ProjectStatusBadge, TaskStatusBadge } from '../status-badge';

const meta = {
  title: 'Common/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'white' } },
  argTypes: {
    variant: { control: 'select', options: ['green', 'amber', 'red', 'gray', 'blue', 'purple', 'violet'] },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Base variants ──────────────────────────────────────────────────────────
export const Green: Story  = { args: { label: 'active',   variant: 'green'  } };
export const Amber: Story  = { args: { label: 'paused',   variant: 'amber'  } };
export const Red: Story    = { args: { label: 'overdue',  variant: 'red'    } };
export const Gray: Story   = { args: { label: 'inactive', variant: 'gray'   } };
export const Blue: Story   = { args: { label: 'in review',variant: 'blue'   } };
export const Purple: Story = { args: { label: 'planned',  variant: 'purple' } };
export const Violet: Story = { args: { label: 'blocked',  variant: 'violet' } };

export const AllVariants: StoryObj = {
  name: 'All Variants — rounded square design',
  parameters: {
    docs: {
      description: {
        story: 'Rounded-square chip with a 1.5×1.5 square dot indicator. `rounded-[6px]` replaces the legacy `rounded-full` pill shape.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusBadge label="green"   variant="green"  />
      <StatusBadge label="amber"   variant="amber"  />
      <StatusBadge label="red"     variant="red"    />
      <StatusBadge label="gray"    variant="gray"   />
      <StatusBadge label="blue"    variant="blue"   />
      <StatusBadge label="purple"  variant="purple" />
      <StatusBadge label="violet"  variant="violet" />
    </div>
  ),
};

// ── Domain helpers ─────────────────────────────────────────────────────────

export const ClientStatuses: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ClientStatusBadge status="active"   />
      <ClientStatusBadge status="inactive" />
      <ClientStatusBadge status="lost"     />
    </div>
  ),
};

export const ProjectStatuses: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ProjectStatusBadge status="active"    />
      <ProjectStatusBadge status="paused"    />
      <ProjectStatusBadge status="completed" />
    </div>
  ),
};

export const TaskStatuses: StoryObj = {
  name: 'Task Statuses — in-progress, todo, to-test, completed',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <TaskStatusBadge status="todo"        />
      <TaskStatusBadge status="in-progress" />
      <TaskStatusBadge status="to-test"     />
      <TaskStatusBadge status="completed"   />
    </div>
  ),
};
