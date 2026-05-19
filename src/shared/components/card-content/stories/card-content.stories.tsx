import type { Meta, StoryObj } from '@storybook/react';
import CardContent from '../card-content';
import ButtonIcon from '../../button-icon/button-icon';

const meta = {
  title: 'Common/CardContent',
  component: CardContent,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'app' } },
  argTypes: {
    variant: { control: 'select', options: ['white', 'lime', 'surface', 'dark'] },
  },
} satisfies Meta<typeof CardContent>;

export default meta;
type Story = StoryObj<typeof meta>;

const Body = () => (
  <div className="px-6 py-5 text-sm text-gray-500">
    Card body content goes here. This area scrolls independently.
  </div>
);

export const White: Story = {
  args: {
    variant: 'white',
    iconName: 'work',
    title: 'Recent Projects',
    children: <Body />,
  },
};

export const WithAction: Story = {
  args: {
    variant: 'white',
    iconName: 'payments',
    title: 'Financials',
    action: <ButtonIcon iconName="arrow_outward" clickHandler={() => {}} aria-label="View all" />,
    children: <Body />,
  },
};

export const Surface: Story = {
  args: {
    variant: 'surface',
    iconName: 'group',
    title: 'Assigned Team',
    children: <Body />,
  },
};

export const Dark: Story = {
  args: {
    variant: 'dark',
    iconName: 'insights',
    title: 'Analytics',
    children: <Body />,
  },
};

export const Lime: Story = {
  args: {
    variant: 'lime',
    iconName: 'bolt',
    title: 'Quick Actions',
    children: <Body />,
  },
};

export const AllVariants: StoryObj = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[640px]">
      {(['white', 'surface', 'dark', 'lime'] as const).map(variant => (
        <CardContent key={variant} variant={variant} iconName="work" title={`${variant} variant`}>
          <div className="px-6 py-5 text-sm opacity-60">Body content</div>
        </CardContent>
      ))}
    </div>
  ),
};
