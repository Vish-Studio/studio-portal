import type { StoryObj } from '@storybook/react';
import { useState } from 'react';
import TaskDetailModal from '../task-detail-modal';
import { DEMO_TASKS } from '@/src/data/seed';

export default {
  title: 'Admin/TaskDetailModal',
  component: TaskDetailModal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

const Wrapper = ({ taskIndex = 0 }: { taskIndex?: number }) => {
  const [open, setOpen] = useState(false);
  const task = DEMO_TASKS[taskIndex];
  return (
    <div className="p-10 min-h-screen bg-gray-100 flex items-start">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-xl"
      >
        View Task
      </button>
      {open && (
        <TaskDetailModal
          task={task}
          onClose={() => setOpen(false)}
          onEdit={() => setOpen(false)}
          onDelete={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export const InProgress: StoryObj = { render: () => <Wrapper taskIndex={1} /> };
export const ToTest: StoryObj    = { render: () => <Wrapper taskIndex={2} /> };
export const Completed: StoryObj = { render: () => <Wrapper taskIndex={0} /> };

export const WithDescription: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    const task = DEMO_TASKS.find(t => !!t.description && t.assigneeIds?.length)!;
    return (
      <div className="p-10 min-h-screen bg-gray-100 flex items-start">
        <button onClick={() => setOpen(true)} className="px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-xl">
          View Task Detail
        </button>
        {open && (
          <TaskDetailModal
            task={task}
            onClose={() => setOpen(false)}
            onEdit={() => setOpen(false)}
            onDelete={() => setOpen(false)}
          />
        )}
      </div>
    );
  },
};
