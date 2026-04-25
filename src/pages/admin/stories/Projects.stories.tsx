import type { Meta, StoryObj } from '@storybook/react';
import Projects from '../../Projects';

const meta = {
  title: 'Pages/Admin/Projects',
  component: Projects,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, iframeHeight: 900 } },
  },
} satisfies Meta<typeof Projects>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const GridView: Story = {
  // Storybook can't easily pre-set component state; document the toggle in notes.
  parameters: {
    docs: {
      description: { story: 'Switch to grid view using the view-toggle in the top right toolbar.' },
    },
  },
};
