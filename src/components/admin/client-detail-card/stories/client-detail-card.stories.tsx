import type { Meta, StoryObj } from '@storybook/react';
import ClientDetailCard from '../client-detail-card';
import { DEMO_CLIENTS } from '@/src/data/clients';

const meta = {
  title: 'Admin/ClientDetailCard',
  component: ClientDetailCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'app' } },
} satisfies Meta<typeof ClientDetailCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveClient: Story = {
  args: { client: DEMO_CLIENTS[0] }, // Sarah Mitchell — active, has projects
};

export const InactiveClient: Story = {
  args: { client: DEMO_CLIENTS[2] }, // Priya Shah — inactive
};

export const LostClient: Story = {
  args: { client: DEMO_CLIENTS[3] }, // Tony Nguyen — lost
};

export const AllClients: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-4 justify-center">
      {DEMO_CLIENTS.slice(0, 3).map(c => (
        <div key={c.id} className="w-72">
          <ClientDetailCard client={c} />
        </div>
      ))}
    </div>
  ),
};
