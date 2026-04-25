import type { Meta, StoryObj } from '@storybook/react';
import Dashboard from '../Dashboard';

const meta = {
  title: 'Pages/Admin/Dashboard',
  component: Dashboard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'white' },
    // Storybook docs: disable args table for full-page stories
    docs: { story: { inline: false, iframeHeight: 900 } },
  },
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
