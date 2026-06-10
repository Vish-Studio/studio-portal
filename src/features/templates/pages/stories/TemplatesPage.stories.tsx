import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import { TemplatesPage } from '@/src/features/templates';

const meta = {
  title: 'Pages/Admin/Templates',
  component: TemplatesPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'white' },
    docs: { story: { inline: false, iframeHeight: 1000 } },
  },
} satisfies Meta<typeof TemplatesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PricingPackages: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Pricing packages/i }));
  },
};

export const PricingEditSidebar: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Pricing packages/i }));
    await userEvent.click(canvas.getAllByRole('button', { name: /Edit/i })[0]);
  },
};
