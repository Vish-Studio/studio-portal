import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TableTab from '../table-tab';

const meta = {
  title: 'Common/TableTab',
  component: TableTab,
  tags: ['autodocs'],
  parameters: { layout: 'padded', backgrounds: { default: 'app' } },
} satisfies Meta<typeof TableTab>;

export default meta;

const TABS = [
  { key: 'all',      label: 'All',      count: 24 },
  { key: 'active',   label: 'Active',   count: 18 },
  { key: 'inactive', label: 'Inactive', count: 4  },
  { key: 'lost',     label: 'Lost',     count: 2  },
];

export const WithTabs: StoryObj = {
  render: () => {
    const [active, setActive] = useState('all');
    return (
      <TableTab
        tabs={TABS}
        activeTab={active}
        onTabChange={setActive}
      />
    );
  },
};

export const WithAction: StoryObj = {
  render: () => {
    const [active, setActive] = useState('all');
    return (
      <TableTab
        tabs={TABS}
        activeTab={active}
        onTabChange={setActive}
        actionLabel="Add Client"
        onAction={() => {}}
      />
    );
  },
};

export const TabsOnly: StoryObj = {
  render: () => {
    const [active, setActive] = useState('all');
    return (
      <div className="w-full max-w-lg">
        <TableTab tabs={TABS} activeTab={active} onTabChange={setActive} />
      </div>
    );
  },
};
