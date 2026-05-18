import type { Meta, StoryObj } from '@storybook/react';
import DocumentOverview from '../document-overview';
import { DEMO_DOCUMENTS } from '@/src/data/documents';

const meta = {
  title: 'Admin/DocumentOverview',
  component: DocumentOverview,
  tags: ['autodocs'],
  parameters: { layout: 'padded', backgrounds: { default: 'app' } },
} satisfies Meta<typeof DocumentOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { documents: DEMO_DOCUMENTS, limit: 5 },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};

export const LimitedTo3: Story = {
  args: { documents: DEMO_DOCUMENTS, limit: 3 },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};
