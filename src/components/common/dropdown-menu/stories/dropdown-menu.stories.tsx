import type { Meta, StoryObj } from '@storybook/react';
import DropdownMenu, { type DropdownMenuSectionType } from '../dropdown-menu';

const meta = {
  title: 'Common/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'white' } },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const notifSections: DropdownMenuSectionType[] = [
  {
    header: 'Notifications',
    items: [
      { label: 'New Client Assigned', description: 'You have been assigned to Acme Inc.' },
      { label: 'System Update', description: 'Maintenance scheduled for tonight.' },
      { label: 'Invoice Paid', description: 'Globex paid INV-003 ($3,200).' },
    ],
  },
];

const userSections: DropdownMenuSectionType[] = [
  {
    header: 'My Account',
    items: [
      { label: 'Profile', onClick: () => {} },
      { label: 'Billing', onClick: () => {} },
      { label: 'Team', onClick: () => {} },
      { label: 'Subscription', onClick: () => {} },
    ],
  },
  {
    items: [{ label: 'Log out', onClick: () => {}, danger: true }],
  },
];

export const Notifications: StoryObj = {
  render: () => (
    <div className="relative w-72">
      <DropdownMenu sections={notifSections} width="w-72" align="right" />
    </div>
  ),
};

export const UserMenu: StoryObj = {
  render: () => (
    <div className="relative w-48">
      <DropdownMenu sections={userSections} width="w-48" align="right" />
    </div>
  ),
};

export const WithDanger: StoryObj = {
  render: () => (
    <div className="relative w-48">
      <DropdownMenu
        sections={[
          {
            items: [
              { label: 'Edit',      onClick: () => {} },
              { label: 'Duplicate', onClick: () => {} },
            ],
          },
          {
            items: [{ label: 'Delete', onClick: () => {}, danger: true }],
          },
        ]}
        width="w-48"
      />
    </div>
  ),
};
