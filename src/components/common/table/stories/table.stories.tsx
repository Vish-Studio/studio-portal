import type { Meta, StoryObj } from '@storybook/react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import TableData, { RowActionsMenu, RowActions, type Column } from '../table';
import StatusBadge from '../../status-badge/status-badge';

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  status: 'active' | 'inactive' | 'lost';
}

const DEMO: Client[] = [
  { id: 'c1', name: 'Sarah Mitchell', company: 'Acme Corp',   email: 'sarah@acme.com',    status: 'active'   },
  { id: 'c2', name: 'James Lee',      company: 'Globex',      email: 'james@globex.com',  status: 'active'   },
  { id: 'c3', name: 'Priya Shah',     company: 'Initech',     email: 'priya@initech.com', status: 'inactive' },
  { id: 'c4', name: 'Tony Nguyen',    company: 'Stark Ind.',  email: 'tony@stark.com',    status: 'lost'     },
  { id: 'c5', name: 'Elena Vasquez',  company: 'Umbrella',    email: 'elena@umbrella.com',status: 'active'   },
];

const VARIANT = { active: 'green', inactive: 'amber', lost: 'red' } as const;

const ACTIONS = [
  { label: 'View',   icon: <Eye size={14} />,    onClick: () => {} },
  { label: 'Edit',   icon: <Pencil size={14} />, onClick: () => {} },
  { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => {}, variant: 'danger' as const },
];

// Columns using the new responsive RowActions (inline on desktop, 3-dot on mobile)
const COLUMNS_RESPONSIVE: Column<Client>[] = [
  {
    key: 'name',
    label: 'Name',
    render: row => (
      <div>
        <p className="font-semibold text-gray-900">{row.name}</p>
        <p className="text-xs text-gray-400 font-mono">{row.id}</p>
      </div>
    ),
  },
  { key: 'company', label: 'Company', hideBelow: 'md' },
  { key: 'email',   label: 'Email',   hideBelow: 'lg',
    render: row => <span className="text-gray-500">{row.email}</span> },
  {
    key: 'status',
    label: 'Status',
    render: row => <StatusBadge label={row.status} variant={VARIANT[row.status]} />,
  },
  {
    key: 'actions', label: '', align: 'right', width: 'w-10 md:w-auto', sortable: false,
    render: () => <RowActions actions={ACTIONS} />,
  },
];

// Columns using the legacy 3-dot RowActionsMenu
const COLUMNS_MENU: Column<Client>[] = [
  {
    key: 'name', label: 'Name',
    render: row => <p className="font-semibold text-gray-900">{row.name}</p>,
  },
  { key: 'company', label: 'Company', hideBelow: 'md' },
  {
    key: 'status', label: 'Status',
    render: row => <StatusBadge label={row.status} variant={VARIANT[row.status]} />,
  },
  {
    key: 'actions', label: '', align: 'right', width: 'w-10', sortable: false,
    render: () => <RowActionsMenu actions={ACTIONS} />,
  },
];

const meta = {
  title: 'Common/TableData',
  component: TableData,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', backgrounds: { default: 'white' } },
} satisfies Meta<typeof TableData>;

export default meta;

export const ResponsiveActions: StoryObj = {
  name: 'RowActions — responsive (desktop inline / mobile 3-dot)',
  parameters: {
    docs: {
      description: {
        story: 'On `md+` screens action buttons appear inline. Below `md` a compact 3-dot dropdown is shown instead.',
      },
    },
  },
  render: () => (
    <div className="p-6 h-screen">
      <TableData<Client> columns={COLUMNS_RESPONSIVE} data={DEMO} className="h-80" />
    </div>
  ),
};

export const LegacyMenu: StoryObj = {
  name: 'RowActionsMenu — always 3-dot (legacy)',
  render: () => (
    <div className="p-6 h-screen">
      <TableData<Client> columns={COLUMNS_MENU} data={DEMO} className="h-80" />
    </div>
  ),
};

export const Populated: StoryObj = {
  render: () => (
    <div className="p-6 h-screen">
      <TableData<Client> columns={COLUMNS_RESPONSIVE} data={DEMO} className="h-96" />
    </div>
  ),
};

export const Loading: StoryObj = {
  render: () => (
    <div className="p-6 h-screen">
      <TableData<Client> columns={COLUMNS_RESPONSIVE} data={[]} loading className="h-96" />
    </div>
  ),
};

export const Empty: StoryObj = {
  render: () => (
    <div className="p-6 h-screen">
      <TableData<Client> columns={COLUMNS_RESPONSIVE} data={[]} emptyMessage="No clients yet." className="h-96" />
    </div>
  ),
};

export const WithDefaultSort: StoryObj = {
  render: () => (
    <div className="p-6 h-screen">
      <TableData<Client>
        columns={COLUMNS_RESPONSIVE}
        data={DEMO}
        defaultSort={{ key: 'name', dir: 'asc' }}
        className="h-96"
      />
    </div>
  ),
};
