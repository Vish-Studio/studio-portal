import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import MonthYearNav from '../month-year-nav';

const meta = {
  title: 'Admin/MonthYearNav',
  component: MonthYearNav,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'white' } },
} satisfies Meta<typeof MonthYearNav>;

export default meta;

export const Interactive: StoryObj = {
  render: () => {
    const [date, setDate] = useState(new Date());
    return (
      <div className="flex flex-col items-center gap-4">
        <MonthYearNav value={date} onChange={setDate} />
        <p className="text-sm text-gray-500">
          {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>
    );
  },
};
