import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MaterialIcon from '../../material-icon/material-icon';
import Tabs from '../tabs';

const meta = {
  title: 'Common/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

const ITEMS = [
  { key: 'all', label: 'All', count: 12 },
  { key: 'active', label: 'Active', count: 7 },
  { key: 'paused', label: 'Paused', count: 3 },
  { key: 'completed', label: 'Completed', count: 2 },
];

export const Default: Story = {
  args: {
    items: ITEMS,
    value: 'all',
  },
  render: () => {
    const [value, setValue] = useState('all');
    return <Tabs items={ITEMS} value={value} onChange={setValue} />;
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { key: 'client', label: 'Clients' },
      { key: 'team', label: 'Team' },
    ],
    value: 'client',
    mobileMode: 'scroll',
  },
  render: () => {
    const [value, setValue] = useState('client');
    return (
      <Tabs
        mobileMode="scroll"
        items={[
          { key: 'client', label: 'Clients', icon: <MaterialIcon name="person" size={16} /> },
          { key: 'team', label: 'Team', icon: <MaterialIcon name="groups" size={16} /> },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};
