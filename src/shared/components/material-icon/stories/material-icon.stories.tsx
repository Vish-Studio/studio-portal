import type { Meta, StoryObj } from '@storybook/react';
import MaterialIcon from '../material-icon';

const meta = {
  title: 'Common/MaterialIcon',
  component: MaterialIcon,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'white' } },
  argTypes: {
    name: { control: 'text' },
    size: { control: 'number' },
  },
} satisfies Meta<typeof MaterialIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'home', size: 24 },
};

export const Sizes: StoryObj = {
  render: () => (
    <div className="flex items-end gap-4">
      {[12, 16, 20, 24, 32, 40].map(s => (
        <div key={s} className="flex flex-col items-center gap-1">
          <MaterialIcon name="star" size={s} />
          <span className="text-xs text-gray-400">{s}px</span>
        </div>
      ))}
    </div>
  ),
};

export const Icons: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {[
        'home', 'work', 'group', 'payments', 'settings', 'notifications',
        'search', 'person', 'edit', 'delete', 'add', 'close',
        'arrow_outward', 'expand_more', 'menu', 'code', 'palette', 'star',
      ].map(name => (
        <div key={name} className="flex flex-col items-center gap-1 w-16">
          <MaterialIcon name={name} size={20} />
          <span className="text-[9px] text-gray-400 text-center truncate w-full">{name}</span>
        </div>
      ))}
    </div>
  ),
};
