import type { Meta, StoryObj } from '@storybook/react';
import ClientDetailCard from '../client-detail-card';
import type { Client } from '../../../types';
import { buildDefaultPhases, type ClientProject } from '@/src/features/projects';

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

const fakeProjects: ClientProject[] = [
  {
    id: 'project-website',
    clientId: fakeClient.id,
    name: 'Learning Platform',
    status: 'active',
    phases: buildDefaultPhases(4),
    agreedPayment: 12000,
    paidPayment: 9000,
    timeline: 'Q3 2026',
    startedAt: new Date('2026-05-27').getTime(),
    service: 'website',
    package: 'essentials',
    assignedMemberIds: ['member-1', 'member-2'],
  },
  {
    id: 'project-mobile',
    clientId: fakeClient.id,
    name: 'Mobile Learning App',
    status: 'active',
    phases: buildDefaultPhases(2),
    agreedPayment: 8500,
    paidPayment: 4000,
    timeline: 'Q4 2026',
    startedAt: new Date('2026-05-28').getTime(),
    service: 'mobile-app',
    package: 'growth',
    assignedMemberIds: ['member-2'],
  },
  {
    id: 'project-brand',
    clientId: fakeClient.id,
    name: 'Brand Guidelines',
    status: 'completed',
    phases: buildDefaultPhases(9),
    agreedPayment: 4000,
    paidPayment: 4000,
    timeline: 'May 2026',
    startedAt: new Date('2026-04-02').getTime(),
    service: 'branding',
    package: 'premium',
    assignedMemberIds: ['member-1'],
  },
];

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
    projects: fakeProjects,
  },
};

export const InactiveWithoutProjects: Story = {
  args: {
    client: fakeInactiveClient,
    projects: [],
  },
};

export const MultipleStates: Story = {
  args: {
    client: fakeClient,
    projects: fakeProjects,
  },
  render: () => (
    <div className="grid gap-6">
      <ClientDetailCard client={fakeClient} projects={fakeProjects} />
      <ClientDetailCard client={fakeInactiveClient} projects={[]} />
    </div>
  ),
};
