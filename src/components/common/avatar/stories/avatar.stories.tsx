import type { Meta, StoryObj } from '@storybook/react';
import Avatar, { AvatarStack } from '../avatar';

// ─── Avatar ───────────────────────────────────────────────────────────────────

const meta = {
  title: 'Common/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'white' } },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    bordered: { control: 'boolean' },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'Sarah Mitchell', size: 'md' },
};

export const Sizes: StoryObj = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar name="Aisha Patel"    id="m1" size="xs" />
      <Avatar name="Jordan Clarke"  id="m2" size="sm" />
      <Avatar name="Mei Lin"        id="m3" size="md" />
      <Avatar name="Samuel Osei"    id="m4" size="lg" />
    </div>
  ),
};

export const DifferentColors: StoryObj = {
  render: () => (
    <div className="flex items-center gap-3">
      {[
        { name: 'Aisha Patel',   id: 'm1' },
        { name: 'Jordan Clarke', id: 'm2' },
        { name: 'Mei Lin',       id: 'm3' },
        { name: 'Samuel Osei',   id: 'm4' },
        { name: 'Priya Nair',    id: 'm5' },
        { name: 'Tom Eriksen',   id: 'm6' },
      ].map(m => (
        <Avatar key={m.id} name={m.name} id={m.id} size="md" />
      ))}
    </div>
  ),
};

export const Bordered: StoryObj = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar name="Aisha Patel"   id="m1" size="md" bordered />
      <Avatar name="Jordan Clarke" id="m2" size="md" bordered />
      <Avatar name="Mei Lin"       id="m3" size="md" bordered />
    </div>
  ),
};

// ─── AvatarStack ──────────────────────────────────────────────────────────────

export const Stack: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      <AvatarStack
        members={[
          { name: 'Aisha Patel',   id: 'm1' },
          { name: 'Jordan Clarke', id: 'm2' },
          { name: 'Mei Lin',       id: 'm3' },
        ]}
        size="sm"
      />
      <AvatarStack
        members={[
          { name: 'Aisha Patel',   id: 'm1' },
          { name: 'Jordan Clarke', id: 'm2' },
          { name: 'Mei Lin',       id: 'm3' },
          { name: 'Samuel Osei',   id: 'm4' },
          { name: 'Priya Nair',    id: 'm5' },
        ]}
        limit={3}
        size="sm"
      />
    </div>
  ),
};
