import type { Meta, StoryObj } from '@storybook/react';
import Button from '../button';
import { ArrowRight, Check, Trash2 } from '@/src/shared/components/material-icon/material-lucide-icons';

const meta = {
  title: 'Common/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'white' } },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: {
    children: 'Save changes',
    variant: 'primary',
    size: 'md',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancel' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Preview' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete', iconLeft: <Trash2 size={14} /> },
};

export const Loading: Story = {
  args: { loading: true, children: 'Saving' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button iconLeft={<Check size={14} />}>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger" iconLeft={<Trash2 size={14} />}>Danger</Button>
      <Button size="sm" iconRight={<ArrowRight size={14} />}>Small</Button>
      <Button loading>Loading</Button>
    </div>
  ),
};
