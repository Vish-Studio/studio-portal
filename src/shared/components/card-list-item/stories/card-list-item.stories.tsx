import type { Meta, StoryObj } from '@storybook/react';
import CardListItem from '../card-list-item';
import { MaterialIcon, RecordMeta, StatusBadge } from '@/src/shared/components';
import { Pencil, Trash2 } from '@/src/shared/components/material-icon/material-lucide-icons';

const meta = {
  title: 'Common/CardListItem',
  component: CardListItem,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'app' } },
} satisfies Meta<typeof CardListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Brand Refresh',
    subtitle: <RecordMeta items={[{ label: 'Website', icon: 'language' }, { label: 'May 27, 2026', icon: 'event' }]} />,
    icon: (
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-(--color-accent-lime) text-(--color-ink)">
        <MaterialIcon name="work" size={18} />
      </div>
    ),
    children: (
      <div className="rounded-2xl bg-gray-50 px-3 py-2.5">
        <p className="type-muted text-gray-500">Landing page and visual identity updates.</p>
      </div>
    ),
    footer: (
      <>
        <StatusBadge label="active" variant="green" />
        <span className="type-label text-gray-400">68% complete</span>
      </>
    ),
    actions: [
      { label: 'Edit', icon: <Pencil size={14} />, onClick: () => undefined },
      { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => undefined, variant: 'danger' },
    ],
  },
};

export const StaticCard: Story = {
  args: {
    title: 'Invoice #1042',
    subtitle: 'Due Friday',
    children: <p className="type-muted text-gray-500">No row action menu, just a framed content card.</p>,
  },
};
