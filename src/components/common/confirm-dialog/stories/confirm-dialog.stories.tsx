import type { StoryObj } from '@storybook/react';
import { useState } from 'react';
import ConfirmDialog from '../confirm-dialog';

export default {
  title: 'Common/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

const Trigger = ({ label, children }: { label: string; children: (open: () => void) => React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-10 min-h-screen bg-gray-100 flex items-start">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-xl"
      >
        {label}
      </button>
      {children(() => setOpen(true))}
      {open && <div style={{ display: 'none' }} />}
      {open && (() => {
        const close = () => setOpen(false);
        return children(close);
      })()}
    </div>
  );
};

export const DeleteDanger: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-10 min-h-screen bg-gray-100 flex items-start">
        <button onClick={() => setOpen(true)} className="px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl">
          Delete Project
        </button>
        <ConfirmDialog
          isOpen={open}
          title="Delete project"
          message='"Brand Refresh" will be permanently removed. This cannot be undone.'
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const DefaultConfirm: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-10 min-h-screen bg-gray-100 flex items-start">
        <button onClick={() => setOpen(true)} className="px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-xl">
          Confirm Action
        </button>
        <ConfirmDialog
          isOpen={open}
          title="Archive client"
          message="This client will be moved to the archive. You can restore them later."
          confirmLabel="Archive"
          cancelLabel="Keep"
          variant="default"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};
