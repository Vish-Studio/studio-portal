import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Modal from '../modal';

const meta = {
  title: 'Common/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Modal>;

export default meta;

// Modal has no isOpen prop — it renders when mounted.
// Wrap in a state-driven parent that shows a trigger button.

export const Dialog: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-8 min-h-screen bg-gray-100 flex items-start">
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl">
          Open Dialog
        </button>
        {open && (
          <Modal
            onClose={() => setOpen(false)}
            title="Confirm Action"
            description="Are you sure you want to proceed? This cannot be undone."
            variant="dialog"
            footer={
              <div className="flex w-full gap-3">
                <button onClick={() => setOpen(false)} className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200">Cancel</button>
                <button className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
              </div>
            }
          >
            <div className="px-6 py-4">
              <p className="text-sm font-medium text-gray-500">Footer actions are equal-width and consistently placed.</p>
            </div>
          </Modal>
        )}
      </div>
    );
  },
};

export const Sheet: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-8 min-h-screen bg-gray-100 flex items-start">
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl">
          Open Sheet
        </button>
        {open && (
          <Modal onClose={() => setOpen(false)} title="Project Details" variant="sheet">
            <div className="px-6 py-4 text-sm text-gray-600">
              Sheet modal content slides in from the bottom.
            </div>
          </Modal>
        )}
      </div>
    );
  },
};
