import type { Meta, StoryObj } from '@storybook/react';
import TasksOverview from '../tasks-overview';
import { DEMO_TASKS } from '@/src/data/tasks';

const meta = {
  title: 'Admin/TasksOverview',
  component: TasksOverview,
  tags: ['autodocs'],
  parameters: { layout: 'padded', backgrounds: { default: 'app' } },
} satisfies Meta<typeof TasksOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { tasks: DEMO_TASKS, limit: 5 },
  decorators: [(Story) => <div className="w-80 h-72"><Story /></div>],
};

export const LimitedTo4: Story = {
  args: { tasks: DEMO_TASKS, limit: 4 },
  decorators: [(Story) => <div className="w-80 h-64"><Story /></div>],
};
