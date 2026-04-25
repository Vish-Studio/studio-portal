import type { Meta, StoryObj } from '@storybook/react';
import ProjectHeroCard from '../project-hero-card';
import { DEMO_PROJECTS } from '@/src/data/projects';

const meta = {
  title: 'Admin/ProjectHeroCard',
  component: ProjectHeroCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'app' } },
} satisfies Meta<typeof ProjectHeroCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BrandingActive: Story = {
  args: { project: DEMO_PROJECTS[0] }, // Brand Refresh — branding, mid-progress
};

export const WebsitePremium: Story = {
  args: { project: DEMO_PROJECTS[2] }, // E-Commerce Redesign — website · premium
};

export const MobileAppCompleted: Story = {
  args: { project: DEMO_PROJECTS[3] }, // Mobile App MVP — completed
};

export const SoftwarePremium: Story = {
  args: { project: DEMO_PROJECTS[5] }, // Dashboard Analytics — software · premium
};

export const AllServices: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-4 justify-center">
      {DEMO_PROJECTS.slice(0, 5).map(p => (
        <div key={p.id} className="w-72">
          <ProjectHeroCard project={p} />
        </div>
      ))}
    </div>
  ),
};
