import type { Meta, StoryObj } from '@storybook/react';
import { PaymentsPage } from '@/src/features/payments';

const meta = {
  title: 'Pages/Admin/Payments',
  component: PaymentsPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, iframeHeight: 900 } },
  },
} satisfies Meta<typeof PaymentsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
