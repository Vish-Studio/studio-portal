import type { Meta, StoryObj } from '@storybook/react';
import Payments from '../Payments';

const meta = {
  title: 'Pages/Admin/Payments',
  component: Payments,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, iframeHeight: 900 } },
  },
} satisfies Meta<typeof Payments>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
