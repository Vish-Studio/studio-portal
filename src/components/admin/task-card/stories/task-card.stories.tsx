import type { Meta, StoryObj } from '@storybook/react';
import TaskCard from '../task-card';
import { DEMO_TASKS } from '@/src/data/tasks';

const meta = {
  title: 'Admin/TaskCard',
  component: TaskCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded', backgrounds: { default: 'app' } },
} satisfies Meta<typeof TaskCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HighPriorityInProgress: Story = {
  args: { task: DEMO_TASKS.find(t => t.status === 'in-progress' && t.priority === 'high')! },
};

export const MediumPriorityToTest: Story = {
  args: { task: DEMO_TASKS.find(t => t.status === 'to-test')! },
};

export const LowPriorityTodo: Story = {
  args: { task: DEMO_TASKS.find(t => t.status === 'todo' && t.priority === 'low')! },
};

export const Completed: Story = {
  args: { task: DEMO_TASKS.find(t => t.status === 'completed')! },
};

export const AllStatuses: StoryObj = {
  render: () => (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 max-w-4xl">
      {(['todo', 'in-progress', 'to-test', 'completed'] as const).map(status => {
        const task = DEMO_TASKS.find(t => t.status === status);
        return task ? <TaskCard key={status} task={task} /> : null;
      })}
    </div>
  ),
};

export const AllPriorities: StoryObj = {
  render: () => (
    <div className="grid grid-cols-3 gap-3 max-w-2xl">
      {(['high', 'medium', 'low'] as const).map(priority => {
        const task = DEMO_TASKS.find(t => t.priority === priority);
        return task ? <TaskCard key={priority} task={task} /> : null;
      })}
    </div>
  ),
};
