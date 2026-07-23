import type { Meta, StoryObj } from '@storybook/react';
import TeamDetailCard from '../team-detail-card';
import type { TeamMember } from '../../../types';

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
    accessRole: 'superadmin',
    email: 'divesh@studio.test',
    assignedProjectId: null,
    status: 'active',
    createdAt: firestoreDate('2026-03-18T09:00:00'),
  },
  {
    id: 'member-seen',
    name: 'Seenarain Vishroy',
    role: 'Frontend Engineer',
    accessRole: 'user',
    email: 'seenarain@studio.test',
    assignedProjectId: null,
    status: 'active',
    createdAt: firestoreDate('2026-04-08T09:00:00'),
  },
  {
    id: 'member-new',
    name: 'Ashvin Kistnasamy',
    role: 'Designer',
    accessRole: 'user',
    email: 'ashvin@studio.test',
    assignedProjectId: null,
    status: 'inactive',
    createdAt: firestoreDate('2026-05-12T09:00:00'),
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
  },
};

export const FreelancerWorkload: Story = {
  args: {
    member: fakeMembers[1],
  },
};

export const EmptyWorkload: Story = {
  args: {
    member: fakeMembers[2],
  },
};

export const MemberStates: StoryObj = {
  render: () => (
    <div className="grid gap-6">
      {fakeMembers.map(member => (
        <TeamDetailCard
          key={member.id}
          member={member}
        />
      ))}
    </div>
  ),
};
