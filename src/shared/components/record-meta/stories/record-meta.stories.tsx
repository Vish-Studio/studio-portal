import type { Meta, StoryObj } from '@storybook/react';
import RecordMeta, { formatRecordDate } from '../record-meta';

const meta = {
  title: 'Common/RecordMeta',
  component: RecordMeta,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'white' } },
  args: {
    items: [
      { label: 'Website', icon: 'language' },
      { label: formatRecordDate('2026-05-27'), icon: 'event' },
      { label: 'Sarah Mitchell', icon: 'person' },
    ],
  },
} satisfies Meta<typeof RecordMeta>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Wrapped: Story = {
  render: () => (
    <div className="w-[220px] rounded-2xl border border-gray-100 bg-white p-4">
      <RecordMeta
        items={[
          { label: 'A very long project name that should truncate', icon: 'work' },
          { label: 'May 27, 2026', icon: 'event' },
          { label: 'High priority', icon: 'priority_high' },
        ]}
      />
    </div>
  ),
};

export const Empty: Story = {
  args: { items: [] },
};
