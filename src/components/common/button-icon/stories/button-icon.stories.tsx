import type { Meta, StoryObj } from '@storybook/react';
import ButtonIcon from '../button-icon';

const meta = {
  title: 'Common/Button/ButtonIcon',
  component: ButtonIcon,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'white' } },
  argTypes: {
    iconName: { control: 'text' },
  },
} satisfies Meta<typeof ButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Notifications: Story = {
  args: { iconName: 'notifications', clickHandler: () => { }, 'aria-label': 'Notifications' },
};

export const Person: Story = {
  args: { iconName: 'person', clickHandler: () => { }, 'aria-label': 'User menu' },
};

export const Search: Story = {
  args: { iconName: 'search', clickHandler: () => { }, 'aria-label': 'Search' },
};

export const WithBadge: StoryObj = {
  render: () => (
    <ButtonIcon iconName="notifications" clickHandler={() => { }} aria-label="Notifications">
      <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
    </ButtonIcon>
  ),
};

export const Row: StoryObj = {
  render: () => (
    <div className="flex items-center gap-2">
      {['search', 'notifications', 'person', 'settings', 'edit', 'delete'].map(icon => (
        <ButtonIcon key={icon} iconName={icon} clickHandler={() => { }} aria-label={icon} />
      ))}
    </div>
  ),
};
