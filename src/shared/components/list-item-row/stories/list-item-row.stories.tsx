import type { Meta, StoryObj } from '@storybook/react';
import ListItemRow from '../list-item-row';
import { MaterialIcon, RecordMeta, StatusBadge } from '@/src/shared/components';
import { Pencil, Trash2 } from '@/src/shared/components/material-icon/material-lucide-icons';

const meta = {
  title: 'Common/ListItemRow',
  component: ListItemRow,
  tags: ['autodocs'],
  parameters: { layout: 'padded', backgrounds: { default: 'app' } },
} satisfies Meta<typeof ListItemRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Implement checkout flow',
    subtitle: <RecordMeta items={[{ label: 'Brand Refresh', icon: 'work' }, { label: 'High priority', icon: 'priority_high' }]} />,
    icon: (
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 text-gray-700">
        <MaterialIcon name="task_alt" size={18} />
      </div>
    ),
    secondary: <span className="type-card-title text-gray-700">Frontend</span>,
    tertiary: <span className="type-card-title text-right text-gray-700">May 27</span>,
    status: <StatusBadge label="in progress" variant="blue" />,
    actions: [
      { label: 'Edit', icon: <Pencil size={14} />, onClick: () => undefined },
      { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => undefined, variant: 'danger' },
    ],
  },
};

export const CompactList: Story = {
  args: {
    title: 'Compact row',
  },
  render: () => (
    <div className="flex flex-col gap-2">
      {['Discovery call', 'Proposal draft', 'Client review'].map((title, index) => (
        <ListItemRow
          key={title}
          title={title}
          subtitle={<RecordMeta items={[{ label: `Step ${index + 1}`, icon: 'route' }]} />}
          tertiary={<span className="type-card-title text-gray-700">{index + 1}d</span>}
          status={<StatusBadge label={index === 2 ? 'blocked' : 'planned'} variant={index === 2 ? 'red' : 'gray'} />}
        />
      ))}
    </div>
  ),
};
