import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ClientPicker from '../client-picker';
import { DEMO_CLIENTS } from '@/src/data/seed';

const meta = {
  title: 'Admin/Pickers/ClientPicker',
  component: ClientPicker,
  tags: ['autodocs'],
  parameters: { layout: 'padded', backgrounds: { default: 'white' } },
} satisfies Meta<typeof ClientPicker>;

export default meta;

export const Empty: StoryObj = {
  render: () => {
    const [id, setId] = useState('');
    return (
      <div className="w-80">
        <p className="text-xs text-gray-400 mb-2">Selected: {id || '—'}</p>
        <ClientPicker clients={DEMO_CLIENTS} selectedId={id} onSelect={setId} />
      </div>
    );
  },
};

export const PreSelected: StoryObj = {
  render: () => {
    const [id, setId] = useState('c1');
    return (
      <div className="w-80">
        <ClientPicker clients={DEMO_CLIENTS} selectedId={id} onSelect={setId} />
      </div>
    );
  },
};
