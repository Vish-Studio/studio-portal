import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import DailySchedule from '../daily-schedule/daily-schedule';
import type { ScheduleEvent } from '../daily-schedule/daily-schedule';
import MonthYearNav from '../month-year-nav/month-year-nav';

const getMockEventsForDate = (year: number, month: number, day: number): ScheduleEvent[] => {
  const events: ScheduleEvent[] = [];
  const seed = year * 10000 + month * 100 + day;

  if (seed % 7 === 0 || seed % 13 === 0) {
    events.push({ type: 'call', title: 'Strategy Sync', time: '10:00 AM' });
  }
  if (seed % 5 === 0) {
    events.push({ type: 'video', title: 'Product Review', time: '1:00 PM' });
  }
  if (seed % 8 === 0) {
    events.push({ type: 'project', title: 'Web App Launch', time: 'All Day' });
  }
  if (seed % 19 === 0) {
    events.push({ type: 'call', title: 'Client Feedback', time: '3:00 PM' });
  }

  const today = new Date();
  if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
    if (events.length === 0) {
      events.push({ type: 'video', title: 'Acme Corp Kickoff', time: '10:00 AM - 11:00 AM' });
      events.push({ type: 'call', title: 'Design Review', time: '01:30 PM - 02:00 PM' });
    }
  }

  return events;
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = new Date(year, month, 1).getDay();

  const handleSelectDate = (day: number) => setSelectedDate(new Date(year, month, day));

  const selectedEvents = useMemo(() => {
    return getMockEventsForDate(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
  }, [selectedDate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Calendar grid — spans 2 of 3 columns */}
      <div className="lg:col-span-2 bg-(--color-surface) rounded-[32px] p-6 sm:p-8 flex flex-col gap-6">

        {/* Title + Month/Year nav on same row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm shrink-0">
              <CalendarIcon size={18} className="text-gray-700" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Calendar</span>
          </div>
          <MonthYearNav value={currentDate} onChange={setCurrentDate} />
        </div>

        {/* Days-of-week header */}
        <div className="grid grid-cols-7">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7 gap-2 -mt-4">
          {Array.from({ length: startDayOfMonth }).map((_, i) => (
            <div key={`empty-start-${i}`} className="p-2" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isSelected =
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === month &&
              selectedDate.getFullYear() === year;

            const events = getMockEventsForDate(year, month, day);
            const hasCall = events.some(e => e.type === 'call' || e.type === 'video');
            const hasProject = events.some(e => e.type === 'project');

            return (
              <div
                key={day}
                onClick={() => handleSelectDate(day)}
                className={`min-h-15 p-2 rounded-[16px] border transition-all flex flex-col relative group cursor-pointer
                  ${isSelected
                    ? 'border-(--color-ink) bg-(--color-ink) text-white shadow-md scale-[1.02]'
                    : 'border-gray-50 bg-white hover:bg-gray-200'}`}
              >
                <span className={`text-sm pl-1 ${isSelected ? 'text-white font-bold' : 'text-gray-700 font-semibold group-hover:text-black'}`}>
                  {day}
                </span>
                <div className="flex gap-1 mt-auto pb-1 pl-1 flex-wrap">
                  {hasCall && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-(--color-accent-lime)' : 'bg-blue-500'}`} />}
                  {hasProject && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-pink-400' : 'bg-pink-500'}`} />}
                </div>
              </div>
            );
          })}

          {Array.from({ length: (7 - ((startDayOfMonth + daysInMonth) % 7)) % 7 }).map((_, i) => (
            <div key={`empty-end-${i}`} className="p-2" />
          ))}
        </div>
      </div>

      {/* Daily schedule — spans 1 of 3 columns */}
      <DailySchedule date={selectedDate} events={selectedEvents} />
    </div>
  );
}
