import type { Meta, StoryObj } from '@storybook/react';
import ProjectCard, { ProjectCardMini } from '../project-card';
import { DEMO_PROJECTS } from '@/src/data/projects';
import { DEMO_MEMBERS } from '@/src/data/team';

const meta = {
  title: 'Admin/ProjectCard',
  component: ProjectCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded', backgrounds: { default: 'app' } },
  argTypes: {
    variant: { control: 'select', options: ['default', 'surface'] },
  },
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Pick a representative project for each story
const branding   = DEMO_PROJECTS[0]; // Brand Refresh (branding)
const website    = DEMO_PROJECTS[2]; // E-Commerce Redesign (website · premium)
const mobile     = DEMO_PROJECTS[3]; // Mobile App MVP (completed)
const software   = DEMO_PROJECTS[5]; // Dashboard Analytics (software · premium)
const logo       = DEMO_PROJECTS[1]; // Social Media Kit (logo-design)

export const DefaultVariant: Story = {
  args: { project: branding, allMembers: DEMO_MEMBERS, variant: 'default' },
};

export const SurfaceVariant: Story = {
  args: { project: branding, allMembers: DEMO_MEMBERS, variant: 'surface' },
};

export const WebsitePremium: Story = {
  args: { project: website, allMembers: DEMO_MEMBERS, variant: 'surface' },
};

export const MobileAppCompleted: Story = {
  args: { project: mobile, allMembers: DEMO_MEMBERS, variant: 'surface' },
};

export const SoftwarePremium: Story = {
  args: { project: software, allMembers: DEMO_MEMBERS, variant: 'surface' },
};

// Grid showing all service-type variations
export const ServiceVariations: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {DEMO_PROJECTS.slice(0, 6).map(p => (
        <ProjectCard key={p.id} project={p} allMembers={DEMO_MEMBERS} variant="surface" />
      ))}
    </div>
  ),
};

// ─── Mini variant ─────────────────────────────────────────────────────────────

export const MiniVariant: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-2 max-w-3xl">
      {DEMO_PROJECTS.slice(0, 6).map(p => (
        <ProjectCardMini key={p.id} project={p} allMembers={DEMO_MEMBERS} />
      ))}
    </div>
  ),
};

export const MiniWithActions: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-2 max-w-3xl">
      {DEMO_PROJECTS.slice(0, 3).map(p => (
        <ProjectCardMini
          key={p.id}
          project={p}
          allMembers={DEMO_MEMBERS}
          actions={[
            { label: 'Edit project',   onClick: () => {} },
            { label: 'Delete project', onClick: () => {}, variant: 'danger' },
          ]}
        />
      ))}
    </div>
  ),
};
