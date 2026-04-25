import type { Meta, StoryObj } from '@storybook/react';
import CalendarPage from '../../Calendar';

const meta = {
  title: 'Pages/Admin/Calendar',
  component: CalendarPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, iframeHeight: 900 },
      description: {
        component:
          'Full calendar page. Add, edit, and delete events using the "+" button in the Daily Schedule panel. ' +
          'Changes persist in useCalendarStore and are reflected on the Dashboard widget.',
      },
    },
  },
} satisfies Meta<typeof CalendarPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
