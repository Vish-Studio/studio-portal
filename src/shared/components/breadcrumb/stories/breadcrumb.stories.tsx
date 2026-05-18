import type { Meta, StoryObj } from '@storybook/react';
import Breadcrumb from '../breadcrumb';

const meta = {
  title: 'Common/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: { layout: 'padded', backgrounds: { default: 'app' } },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClientsBreadcrumb: Story = {
  args: {
    previousLink: '/admin/clients',
    previousPageName: 'Clients',
    currentPageName: 'Sarah Mitchell',
  },
};

export const ProjectsBreadcrumb: Story = {
  args: {
    previousLink: '/admin/projects',
    previousPageName: 'Projects',
    currentPageName: 'Brand Refresh',
  },
};
