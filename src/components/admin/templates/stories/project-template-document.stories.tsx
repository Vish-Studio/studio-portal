import type { Meta, StoryObj } from '@storybook/react';
import ProjectTemplateDocument from '../project-template-document';
import { getDefaultBlocks } from '../../../../data/template-blocks';

const meta = {
  title: 'Admin/Templates/ProjectTemplateDocument',
  component: ProjectTemplateDocument,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    slug: 'project-proposal',
    title: 'Project Proposal',
    blocks: getDefaultBlocks('project-proposal'),
    clientName: 'Acme Studio',
    clientEmail: 'hello@acme.studio',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto w-[760px] bg-white shadow-sm">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectTemplateDocument>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Proposal: Story = {};

export const Invoice: Story = {
  args: {
    slug: 'invoice',
    title: 'Invoice',
    blocks: getDefaultBlocks('invoice'),
  },
};
