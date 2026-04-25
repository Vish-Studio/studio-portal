import type { Meta, StoryObj } from '@storybook/react';
import Clients from '../Clients';

const meta = {
  title: 'Pages/Admin/Clients',
  component: Clients,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, iframeHeight: 900 } },
  },
} satisfies Meta<typeof Clients>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
