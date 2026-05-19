import type { Meta, StoryObj } from '@storybook/react';
import { AdminDashboardPage } from '@/src/features/dashboard';

const meta = {
  title: 'Pages/Admin/Dashboard',
  component: AdminDashboardPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'white' },
    // Storybook docs: disable args table for full-page stories
    docs: { story: { inline: false, iframeHeight: 900 } },
  },
} satisfies Meta<typeof AdminDashboardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
