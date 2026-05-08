import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ScheduleSidebarForm from '../schedule-sidebar-form';

const meta = {
  title: 'Admin/Schedule/ScheduleSidebarForm',
  component: ScheduleSidebarForm,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ScheduleSidebarForm>;

export default meta;

export const NewEvent: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-8 min-h-screen bg-gray-100 flex items-start">
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl"
        >
          Add Event
        </button>
        {open && (
          <ScheduleSidebarForm
            date={new Date()}
            onAdd={(event, date) => { console.log('Added', event, date); setOpen(false); }}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    );
  },
};

export const EditEvent: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-8 min-h-screen bg-gray-100 flex items-start">
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl"
        >
          Edit Event
        </button>
        {open && (
          <ScheduleSidebarForm
            date={new Date()}
            initialEvent={{
              id: 'ev1',
              type: 'design-review',
              title: 'Brand Refresh Design Review',
              time: '2:00 PM – 3:00 PM',
              projectId: 'p1',
            }}
            onAdd={(event, date) => { console.log('Updated', event, date); setOpen(false); }}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    );
  },
};
