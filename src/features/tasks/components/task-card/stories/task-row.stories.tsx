import type { Meta, StoryObj } from '@storybook/react';
import TaskRow from '../task-row';
import { DEMO_TASKS } from '@/src/data/seed';

const meta = {
  title: 'Admin/TaskRow',
  component: TaskRow,
  tags: ['autodocs'],
  parameters: { layout: 'padded', backgrounds: { default: 'app' } },
} satisfies Meta<typeof TaskRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { task: DEMO_TASKS.find(t => t.status === 'in-progress' && t.priority === 'high')! },
  decorators: [Story => <div className="max-w-2xl"><Story /></div>],
};

export const WithoutProject: Story = {
  args: {
    task: DEMO_TASKS.find(t => t.status === 'to-test')!,
    showProject: false,
  },
  decorators: [Story => <div className="max-w-2xl"><Story /></div>],
};

export const Overdue: Story = {
  args: {
    task: {
      ...DEMO_TASKS[0],
      status: 'todo' as const,
      dueDate: '2024-01-01',
      title: 'Overdue task example',
    },
  },
  decorators: [Story => <div className="max-w-2xl"><Story /></div>],
};

export const AllStatuses: StoryObj = {
  render: () => (
    <div className="max-w-2xl flex flex-col gap-2">
      {(['todo', 'in-progress', 'to-test', 'completed'] as const).map(status => {
        const task = DEMO_TASKS.find(t => t.status === status);
        return task ? <TaskRow key={status} task={task} /> : null;
      })}
    </div>
  ),
};
