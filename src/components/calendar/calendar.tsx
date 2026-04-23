import { useState, useMemo } from 'react';
import DailySchedule from '../daily-schedule/daily-schedule';
import MonthYearNav from '../month-year-nav/month-year-nav';
import ContentCard from '../content-card/content-card';
import { EVENT_TYPE_CONFIG } from '../schedule/event-types';
import type { ScheduleEvent, EventType } from '../schedule/event-types';
import { useCalendarStore } from '../../store/calendar';
import { DAY_NAMES_SHORT, DAY_NAMES_LONG, MOCK_EVENT_SEEDS, TODAY_DEFAULT_EVENTS } from '../../data/calendar';

const dateKey = (year: number, month: number, day: number) => `${year}-${month}-${day}`;

const getDayLabel = (date: Date): string => {
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
  return isToday ? 'Today' : DAY_NAMES_LONG[date.getDay()];
};

const getMockEventsForDate = (year: number, month: number, day: number): ScheduleEvent[] => {
  const events: ScheduleEvent[] = [];
  const seed = year * 10000 + month * 100 + day;

  for (const s of MOCK_EVENT_SEEDS) {
    if (seed % s.modulo === 0) {
      events.push({ id: `mock-${seed}-${s.index}`, type: s.type as EventType, title: s.title, time: s.time });
    }
  }

  const today = new Date();
  if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate() && events.length === 0) {
    for (const e of TODAY_DEFAULT_EVENTS) {
      events.push({ id: e.idSuffix, type: e.type as EventType, title: e.title, time: e.time });
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
    <div className="calendar grid grid-cols-1 lg:grid-cols-3 gap-6 h-fit md:h-[585px]">

      {/* Calendar grid — spans 2 of 3 columns */}
      <ContentCard
        className="lg:col-span-2"
        iconName="calendar_today"
        title={getDayLabel(selectedDate)}
        action={<MonthYearNav value={currentDate} onChange={setCurrentDate} />}
        bodyClassName="px-4 md:px-6 pb-4 md:pb-6 pt-4 flex flex-col gap-4 overflow-y-auto"
      >

          {/* Days-of-week header */}
          <div className="grid grid-cols-7">
            {DAY_NAMES_SHORT.map(day => (
              <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-2 -mt-2">
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
                      : 'border-transparent bg-(--color-surface) hover:bg-gray-200'}`}
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
      </ContentCard>

      {/* Daily schedule — spans 1 of 3 columns */}
      <DailySchedule date={selectedDate} events={selectedEvents} onAddEvent={handleAddEvent} onEditEvent={handleEditEvent} onRemoveEvent={handleRemoveEvent} />
    </div>
  );
}
