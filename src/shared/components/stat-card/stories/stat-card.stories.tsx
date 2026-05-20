import type { Meta, StoryObj } from '@storybook/react';
import { TrendingUp, TrendingDown, Command, Users, CreditCard, Briefcase } from '@/src/shared/components/material-icon/material-lucide-icons';
import StatCard from '../stat-card';

const meta = {
  title: 'Common/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['lime', 'surface', 'dark', 'white'] },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lime: Story = {
  args: {
    variant: 'lime',
    icon: <Command size={16} />,
    label: 'Ongoing Projects',
    value: '12',
    badge: '68% capacity',
    badgeLabel: 'Projects in progress',
  },
};

export const Surface: Story = {
  args: {
    variant: 'surface',
    icon: <Users size={16} />,
    label: 'Client Overview',
    value: '24',
    badge: <><TrendingUp size={14} className="text-green-600" /> +12%</>,
    badgeLabel: 'Active this month',
  },
};

export const Dark: Story = {
  args: {
    variant: 'dark',
    icon: <CreditCard size={16} />,
    label: 'Payment Overview',
    value: '$18,240',
    valueSubLabel: 'collected',
    badge: <><TrendingDown size={14} className="text-red-400" /> -5%</>,
    badgeLabel: 'Versus last month',
  },
};

export const White: Story = {
  args: {
    variant: 'white',
    icon: <Briefcase size={16} />,
    label: 'Total Projects',
    value: '36',
    badge: '8 active',
    badgeLabel: 'in progress',
  },
};

export const AllVariants: StoryObj = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[700px]">
      <StatCard variant="lime"    icon={<Command size={16} />}   label="Ongoing Projects" value="12" badge="68% capacity" badgeLabel="in progress" />
      <StatCard variant="surface" icon={<Users size={16} />}     label="Client Overview"  value="24" badge="+12%" badgeLabel="vs last month" />
      <StatCard variant="dark"    icon={<CreditCard size={16} />} label="Payment Overview" value="$18k" badge="-5%" badgeLabel="vs last month" />
      <StatCard variant="white"   icon={<Briefcase size={16} />} label="Total Projects"   value="36" badge="8 active" badgeLabel="in progress" />
    </div>
  ),
};
