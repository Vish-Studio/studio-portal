import type { Meta, StoryObj } from '@storybook/react';
import DailySchedule from '../daily-schedule';
import type { ScheduleEvent } from '../../schedule/event-types';

const SAMPLE_EVENTS: ScheduleEvent[] = [
  { id: 'e1', type: 'onboarding',     title: 'Acme Corp Kickoff',     time: '10:00 AM – 11:00 AM' },
  { id: 'e2', type: 'design-review',  title: 'Brand Review',          time: '1:30 PM – 2:00 PM'  },
  { id: 'e3', type: 'brief',          title: 'Q3 Strategy Sync',      time: '3:00 PM'             },
  { id: 'e4', type: 'client-feedback',title: 'Globex Feedback Call',  time: 'All Day'             },
];

const meta = {
  title: 'Admin/DailySchedule',
  component: DailySchedule,
  tags: ['autodocs'],
  parameters: { layout: 'padded', backgrounds: { default: 'app' } },
} satisfies Meta<typeof DailySchedule>;

export default meta;

export const WithEvents: StoryObj = {
  render: () => (
    <div className="w-80 h-[480px]">
      <DailySchedule
        date={new Date()}
        events={SAMPLE_EVENTS}
        onAddEvent={() => {}}
        onEditEvent={() => {}}
        onRemoveEvent={() => {}}
      />
    </div>
  ),
};

export const Empty: StoryObj = {
  render: () => (
    <div className="w-80 h-[480px]">
      <DailySchedule
        date={new Date()}
        events={[]}
        onAddEvent={() => {}}
        onEditEvent={() => {}}
        onRemoveEvent={() => {}}
      />
    </div>
  ),
};

export const ReadOnly: StoryObj = {
  name: 'Read-only (no CRUD callbacks)',
  render: () => (
    <div className="w-80 h-[480px]">
      <DailySchedule date={new Date()} events={SAMPLE_EVENTS} />
    </div>
  ),
};
