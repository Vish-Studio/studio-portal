import type { Meta, StoryObj } from '@storybook/react';
import TeamDetailCard from '../team-detail-card';
import { DEMO_MEMBERS, DEMO_PROJECTS } from '@/src/data/seed';
import type { Task } from '@/src/features/tasks';

const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Review homepage wireframes',
    projectId: DEMO_PROJECTS[0].id,
    status: 'in-progress',
    priority: 'high',
    assigneeIds: [DEMO_MEMBERS[0].id],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now(),
  },
  {
    id: 'task-2',
    title: 'Prepare launch checklist',
    projectId: DEMO_PROJECTS[1].id,
    status: 'completed',
    priority: 'medium',
    assigneeIds: [DEMO_MEMBERS[0].id],
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 3600000,
  },
];

const meta = {
  title: 'Admin/TeamDetailCard',
  component: TeamDetailCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'app' } },
} satisfies Meta<typeof TeamDetailCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    member: DEMO_MEMBERS[0],
    projects: DEMO_PROJECTS.slice(0, 2),
    tasks,
  },
};

export const FullWidthDetail: StoryObj = {
  render: () => (
    <div className="w-[980px] max-w-[calc(100vw-48px)]">
      <TeamDetailCard member={DEMO_MEMBERS[0]} projects={DEMO_PROJECTS.slice(0, 2)} tasks={tasks} />
    </div>
  ),
};
