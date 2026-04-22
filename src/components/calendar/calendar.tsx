import { useState, useMemo, useEffect } from 'react';
import DailySchedule from '../daily-schedule/daily-schedule';
import MonthYearNav from '../month-year-nav/month-year-nav';
import MaterialIcon from '../ui/material-icon';
import { EVENT_TYPE_CONFIG } from '../schedule/event-types';
import type { ScheduleEvent, EventType } from '../schedule/event-types';
import { useCalendarStore } from '../../store/calendar';

const dateKey = (year: number, month: number, day: number) => `${year}-${month}-${day}`;

const getDayLabel = (date: Date): string => {
  const today = new Date();
  const isToday = date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  if (isToday) return 'Today';

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

const getMockEventsForDate = (year: number, month: number, day: number): ScheduleEvent[] => {
  const events: ScheduleEvent[] = [];
  const seed = year * 10000 + month * 100 + day;

  if (seed % 7 === 0 || seed % 13 === 0) {
    events.push({ id: `mock-${seed}-0`, type: 'brief', title: 'Strategy Sync', time: '10:00 AM' });
  }
  if (seed % 5 === 0) {
    events.push({ id: `mock-${seed}-1`, type: 'design-review', title: 'Product Review', time: '1:00 PM' });
  }
  if (seed % 8 === 0) {
    events.push({ id: `mock-${seed}-2`, type: 'launch', title: 'Web App Launch', time: 'All Day' });
  }
  if (seed % 19 === 0) {
    events.push({ id: `mock-${seed}-3`, type: 'client-feedback', title: 'Client Feedback', time: '3:00 PM' });
  }

  const today = new Date();
  if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
    if (events.length === 0) {
      events.push({ id: 'today-0', type: 'onboarding', title: 'Acme Corp Kickoff', time: '10:00 AM - 11:00 AM' });
      events.push({ id: 'today-1', type: 'design-review', title: 'Design Review', time: '01:30 PM - 02:00 PM' });
    }
  }

  return events;
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const customEvents = useCalendarStore((state) => state.customEvents);
  const handleAddEvent = useCalendarStore((state) => state.addEvent);
  const handleEditEvent = useCalendarStore((state) => state.editEvent);
  const handleRemoveEvent = useCalendarStore((state) => state.removeEvent);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = new Date(year, month, 1).getDay();

  const handleSelectDate = (day: number) => setSelectedDate(new Date(year, month, day));

  const getEventsForDate = (y: number, m: number, d: number): ScheduleEvent[] => {
    const mock = getMockEventsForDate(y, m, d);
    const custom = customEvents[dateKey(y, m, d)] ?? [];

    // Collect all custom event ids that came from mock events (to filter out edited mock events)
    const editedMockIds = new Set<string>();
    Object.values(customEvents).flat().forEach(e => {
      if (e.id.startsWith('mock-')) {
        editedMockIds.add(e.id);
      }
    });

    // Filter out mock events that have been edited (exist in custom)
    return [...mock.filter(e => !editedMockIds.has(e.id)), ...custom];
  };

  const selectedEvents = useMemo(
    () => getEventsForDate(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()),
    [selectedDate, customEvents]
  );

  return (
    <div className="calendar grid grid-cols-1 lg:grid-cols-3 gap-6 h-[585px]">

      {/* Calendar grid — spans 2 of 3 columns */}
      <div className="lg:col-span-2 bg-(--color-surface) rounded-[32px] p-6 sm:p-8 flex flex-col gap-6 overflow-y-auto">

        {/* Day label + Time + Month/Year nav */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-900">
            <MaterialIcon name="calendar_today" size={20} />
            <span className="text-xl font-semibold ">{getDayLabel(selectedDate)}</span>
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

            const events = getEventsForDate(year, month, day);
            const dotTypes = [...new Set(events.map(e => e.type))].slice(0, 3) as EventType[];

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
                  {dotTypes.map(type => (
                    <div
                      key={type}
                      className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/60' : EVENT_TYPE_CONFIG[type].dotClass}`}
                    />
                  ))}
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
      <DailySchedule date={selectedDate} events={selectedEvents} onAddEvent={handleAddEvent} onEditEvent={handleEditEvent} onRemoveEvent={handleRemoveEvent} />
    </div>
  );
}
