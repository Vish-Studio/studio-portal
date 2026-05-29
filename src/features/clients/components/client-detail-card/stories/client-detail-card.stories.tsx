import type { Meta, StoryObj } from '@storybook/react';
import ClientDetailCard from '../client-detail-card';
import type { Client } from '../../../types';

const createdAt = (date: string) => ({
  toDate: () => new Date(date),
  toMillis: () => new Date(date).getTime(),
});

const fakeClient: Client = {
  id: 'client-ikigai',
  fullName: 'Janesh Luximan',
  companyName: 'Ikigai Learning NGO',
  email: 'janesh@ikigai.test',
  phone: '+230 5818 8684',
  status: 'active',
  createdAt: createdAt('2026-05-21'),
};

const fakeInactiveClient: Client = {
  id: 'client-novacart',
  fullName: 'Maya Chen',
  companyName: 'NovaCart',
  email: 'maya@novacart.test',
  phone: '+1 555 120 4400',
  status: 'inactive',
  createdAt: createdAt('2026-02-12'),
};

const meta = {
  title: 'Features/Clients/Components/ClientDetailCard',
  component: ClientDetailCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'app' },
  },
  decorators: [
    Story => (
      <div className="w-[1040px] max-w-[calc(100vw-48px)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ClientDetailCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveWithProjects: Story = {
  args: {
    client: fakeClient,
  },
};

export const InactiveWithoutProjects: Story = {
  args: {
    client: fakeInactiveClient,
  },
};

export const MultipleStates: Story = {
  args: {
    client: fakeClient,
  },
  render: () => (
    <div className="grid gap-6">
      <ClientDetailCard client={fakeClient} />
      <ClientDetailCard client={fakeInactiveClient} />
    </div>
  ),
};
