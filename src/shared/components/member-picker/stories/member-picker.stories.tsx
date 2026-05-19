import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import MemberPicker from '../member-picker';
import { DEMO_MEMBERS } from '@/src/data/seed';

const meta = {
  title: 'Admin/Pickers/MemberPicker',
  component: MemberPicker,
  tags: ['autodocs'],
  parameters: { layout: 'padded', backgrounds: { default: 'white' } },
} satisfies Meta<typeof MemberPicker>;

export default meta;

export const Empty: StoryObj = {
  render: () => {
    const [ids, setIds] = useState<string[]>([]);
    const toggle = (id: string) =>
      setIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    return (
      <div className="w-80">
        <p className="text-xs text-gray-400 mb-2">Selected: {ids.join(', ') || '—'}</p>
        <MemberPicker members={DEMO_MEMBERS} selectedIds={ids} onToggle={toggle} />
      </div>
    );
  },
};

export const PreSelected: StoryObj = {
  render: () => {
    const [ids, setIds] = useState<string[]>(['m1', 'm3']);
    const toggle = (id: string) =>
      setIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    return (
      <div className="w-80">
        <MemberPicker members={DEMO_MEMBERS} selectedIds={ids} onToggle={toggle} />
      </div>
    );
  },
};
