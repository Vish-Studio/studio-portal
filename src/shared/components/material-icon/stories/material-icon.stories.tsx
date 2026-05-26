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

export const Filled: StoryObj = {
  render: () => (
    <div className="flex items-center gap-4">
      {['home', 'person', 'calendar_month', 'check_circle', 'error'].map(name => (
        <div key={name} className="flex flex-col items-center gap-1">
          <MaterialIcon name={name} size={28} fill />
          <span className="w-20 truncate text-center text-[10px] text-gray-400">{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const AppIconSet: StoryObj = {
  render: () => {
    const icons = [
      'home', 'calendar_month', 'group', 'work', 'task_alt', 'chat_bubble',
      'credit_card', 'description', 'request_quote', 'dashboard', 'settings',
      'search', 'notifications', 'person', 'edit_note', 'delete', 'add',
      'close', 'event', 'schedule', 'link', 'payments', 'receipt_long',
      'contract', 'design_services', 'rocket_launch', 'fact_check', 'route',
      'warning', 'priority_high', 'visibility', 'open_in_new',
    ];

    return (
      <div className="grid max-w-4xl grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
        {icons.map(name => (
          <div key={name} className="flex min-w-0 flex-col items-center gap-1 rounded-xl border border-gray-100 bg-white p-3">
            <MaterialIcon name={name} size={22} />
            <span className="w-full truncate text-center text-[10px] font-medium text-gray-400">{name}</span>
          </div>
        ))}
      </div>
    );
  },
};
