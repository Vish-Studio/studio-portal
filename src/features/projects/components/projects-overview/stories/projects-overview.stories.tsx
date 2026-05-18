import type { Meta, StoryObj } from '@storybook/react';
import ProjectsOverview from '../projects-overview';
import { DEMO_PROJECTS } from '@/src/data/projects';
import { DEMO_MEMBERS } from '@/src/data/team';

const meta = {
  title: 'Admin/ProjectsOverview',
  component: ProjectsOverview,
  tags: ['autodocs'],
  parameters: { layout: 'padded', backgrounds: { default: 'app' } },
} satisfies Meta<typeof ProjectsOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { projects: DEMO_PROJECTS, members: DEMO_MEMBERS, limit: 4 },
  decorators: [(Story) => <div className="w-[480px] h-80"><Story /></div>],
};

export const LimitedTo2: Story = {
  args: { projects: DEMO_PROJECTS, members: DEMO_MEMBERS, limit: 2 },
  decorators: [(Story) => <div className="w-[480px]"><Story /></div>],
};
