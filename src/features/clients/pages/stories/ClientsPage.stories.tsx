import type { Meta, StoryObj } from '@storybook/react';
import ClientsPage from '../ClientsPage';

const meta = {
  title: 'Features/Clients/Pages/ClientsPage',
  component: ClientsPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, iframeHeight: 900 } },
  },
} satisfies Meta<typeof ClientsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
