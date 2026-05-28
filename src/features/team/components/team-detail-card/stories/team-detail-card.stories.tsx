import type { Meta, StoryObj } from '@storybook/react';
import TeamDetailCard from '../team-detail-card';
import { buildDefaultPhases, type ClientProject } from '@/src/features/projects';
import type { Task } from '@/src/features/tasks';
import type { TeamMember } from '../../../types';

const timestamp = (date: string) => new Date(date).getTime();
const firestoreDate = (date: string) => {
  const value = new Date(date);
  return {
    toMillis: () => value.getTime(),
    toDate: () => value,
  };
};

const fakeMembers: TeamMember[] = [
  {
    id: 'member-divesh',
    name: 'Divesh Heeramun',
    role: 'Project Manager',
    accessRole: 'admin',
    email: 'divesh@studio.test',
    assignedProjectId: null,
    status: 'active',
    createdAt: firestoreDate('2026-03-18T09:00:00'),
  },
  {
    id: 'member-seen',
    name: 'Seenarain Vishroy',
    role: 'Frontend Engineer',
    accessRole: 'freelancer',
    email: 'seenarain@studio.test',
    assignedProjectId: null,
    status: 'active',
    createdAt: firestoreDate('2026-04-08T09:00:00'),
  },
  {
    id: 'member-new',
    name: 'Ashvin Kistnasamy',
    role: 'Designer',
    accessRole: 'team',
    email: 'ashvin@studio.test',
    assignedProjectId: null,
    status: 'inactive',
    createdAt: firestoreDate('2026-05-12T09:00:00'),
  },
];

const fakeProjects: ClientProject[] = [
  {
    id: 'project-learning',
    clientId: 'client-ikigai',
    name: 'Ikigai Learning Platform',
    status: 'active',
    phases: buildDefaultPhases(5),
    agreedPayment: 12000,
    paidPayment: 9000,
    timeline: 'Q3 2026',
    startedAt: timestamp('2026-05-27'),
    service: 'website',
    package: 'growth',
    assignedMemberIds: ['member-divesh', 'member-seen'],
  },
  {
    id: 'project-dashboard',
    clientId: 'client-studio',
    name: 'Studio Operations Dashboard',
    status: 'paused',
    phases: buildDefaultPhases(3),
    agreedPayment: 18000,
    paidPayment: 6000,
    timeline: 'Q4 2026',
    startedAt: timestamp('2026-04-14'),
    service: 'software',
    package: 'premium',
    assignedMemberIds: ['member-divesh'],
  },
  {
    id: 'project-brand',
    clientId: 'client-aura',
    name: 'Aura Brand System',
    status: 'completed',
    phases: buildDefaultPhases(9),
    agreedPayment: 6500,
    paidPayment: 6500,
    timeline: 'May 2026',
    startedAt: timestamp('2026-03-02'),
    service: 'branding',
    assignedMemberIds: ['member-seen'],
  },
];

const fakeTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Review homepage wireframes',
    projectId: fakeProjects[0].id,
    status: 'in-progress',
    priority: 'high',
    assigneeIds: ['member-divesh'],
    createdAt: timestamp('2026-05-20'),
    updatedAt: timestamp('2026-05-25'),
  },
  {
    id: 'task-2',
    title: 'Prepare launch checklist',
    projectId: fakeProjects[1].id,
    status: 'completed',
    priority: 'medium',
    assigneeIds: ['member-divesh'],
    createdAt: timestamp('2026-05-16'),
    updatedAt: timestamp('2026-05-22'),
  },
  {
    id: 'task-3',
    title: 'Build responsive header',
    projectId: fakeProjects[0].id,
    status: 'todo',
    priority: 'medium',
    assigneeIds: ['member-seen'],
    createdAt: timestamp('2026-05-23'),
    updatedAt: timestamp('2026-05-23'),
  },
];

const meta = {
  title: 'Features/Team/Components/TeamDetailCard',
  component: TeamDetailCard,
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
} satisfies Meta<typeof TeamDetailCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AdminWorkload: Story = {
  args: {
    member: fakeMembers[0],
    projects: fakeProjects.filter(project => project.assignedMemberIds?.includes(fakeMembers[0].id)),
    tasks: fakeTasks.filter(task => task.assigneeIds?.includes(fakeMembers[0].id)),
  },
};

export const FreelancerWorkload: Story = {
  args: {
    member: fakeMembers[1],
    projects: fakeProjects.filter(project => project.assignedMemberIds?.includes(fakeMembers[1].id)),
    tasks: fakeTasks.filter(task => task.assigneeIds?.includes(fakeMembers[1].id)),
  },
};

export const EmptyWorkload: Story = {
  args: {
    member: fakeMembers[2],
    projects: [],
    tasks: [],
  },
};

export const MemberStates: StoryObj = {
  render: () => (
    <div className="grid gap-6">
      {fakeMembers.map(member => (
        <TeamDetailCard
          key={member.id}
          member={member}
          projects={fakeProjects.filter(project => project.assignedMemberIds?.includes(member.id))}
          tasks={fakeTasks.filter(task => task.assigneeIds?.includes(member.id))}
        />
      ))}
    </div>
  ),
};
