import type { Meta, StoryObj } from '@storybook/react';
import ProjectHeroCard from '../project-hero-card';
import { buildDefaultPhases, type ClientProject } from '@/src/features/projects';
import { useClientsStore } from '@/src/features/clients';
import type { Client } from '@/src/features/clients';

const fakeClient: Client = {
  id: 'client-ikigai',
  fullName: 'Janesh Luximan',
  companyName: 'Ikigai Learning NGO',
  email: 'janesh@ikigai.test',
  phone: '+230 5818 8684',
  status: 'active',
};

const fakeProjects: ClientProject[] = [
  {
    id: 'project-learning-platform',
    clientId: fakeClient.id,
    name: 'Ikigai Learning Platform',
    status: 'active',
    phases: buildDefaultPhases(5),
    agreedPayment: 12000,
    paidPayment: 9000,
    timeline: 'Q3 2026',
    startedAt: new Date('2026-05-27').getTime(),
    service: 'website',
    package: 'essentials',
    assignedMemberIds: ['member-1', 'member-2'],
  },
  {
    id: 'project-saas-dashboard',
    clientId: fakeClient.id,
    name: 'Studio SaaS Dashboard',
    status: 'active',
    phases: buildDefaultPhases(3),
    agreedPayment: 28000,
    paidPayment: 12000,
    timeline: 'Q4 2026',
    startedAt: new Date('2026-04-10').getTime(),
    service: 'software',
    package: 'premium',
    assignedMemberIds: ['member-1'],
  },
  {
    id: 'project-brand-system',
    clientId: fakeClient.id,
    name: 'Brand System',
    status: 'completed',
    phases: buildDefaultPhases(9),
    agreedPayment: 6500,
    paidPayment: 6500,
    timeline: 'May 2026',
    startedAt: new Date('2026-03-12').getTime(),
    service: 'branding',
    assignedMemberIds: ['member-3'],
  },
];

const meta = {
  title: 'Features/Projects/Components/ProjectHeroCard',
  component: ProjectHeroCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'app' },
  },
  decorators: [
    Story => {
      useClientsStore.getState().setClients([fakeClient]);
      return (
        <div className="w-[1040px] max-w-[calc(100vw-48px)]">
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof ProjectHeroCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveWebsite: Story = {
  args: { project: fakeProjects[0] },
};

export const ActiveSoftware: Story = {
  args: { project: fakeProjects[1] },
};

export const CompletedBranding: Story = {
  args: { project: fakeProjects[2] },
};

export const ProjectStates: Story = {
  args: { project: fakeProjects[0] },
  render: () => (
    <div className="grid gap-6">
      {fakeProjects.map(project => <ProjectHeroCard key={project.id} project={project} />)}
    </div>
  ),
};
