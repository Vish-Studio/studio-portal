import { useState, useMemo } from 'react';
import UserLayout from '@/src/components/user/user-layout/user-layout';
import CardContent from '@/src/components/common/card-content/card-content';
import MonthYearNav from '@/src/components/admin/month-year-nav/month-year-nav';
import MaterialIcon from '@/src/components/common/material-icon/material-icon';
import ButtonIcon from '@/src/components/common/button-icon/button-icon';
import AddEventModal from '@/src/components/admin/schedule/add-event-modal';
import { EVENT_TYPE_CONFIG } from '@/src/components/admin/schedule/event-types';
import type { EventType } from '@/src/components/admin/schedule/event-types';
import { useCalendarStore } from '@/src/store/calendar';
import { DAY_NAMES_SHORT, DAY_NAMES_LONG, getEventsForDate } from '@/src/data/calendar';

const UserCalendar = () => {
  const [currentDate, setCurrentDate]     = useState(new Date());
  const [selectedDate, setSelectedDate]   = useState(new Date());
  const [addModalOpen, setAddModalOpen]   = useState(false);

  const customEvents  = useCalendarStore(s => s.customEvents);
  const addEvent      = useCalendarStore(s => s.addEvent);

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth     = new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = new Date(year, month, 1).getDay();
  const trailingPad     = (7 - ((startDayOfMonth + daysInMonth) % 7)) % 7;

  const selectedEvents = useMemo(
    () => getEventsForDate(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      customEvents,
    ),
    [selectedDate, customEvents],
  );

  const getDayLabel = (date: Date) => {
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
    return isToday ? 'Today' : DAY_NAMES_LONG[date.getDay()];
  };

  return (
    <UserLayout title="Calendar">
      <div className="flex flex-col gap-4 md:gap-6">

        {/* Calendar grid */}
        <CardContent
          iconName="calendar_today"
          title={getDayLabel(selectedDate)}
          action={<MonthYearNav value={currentDate} onChange={setCurrentDate} />}
          bodyClassName="px-4 md:px-6 pb-4 md:pb-6 pt-4 flex flex-col gap-4"
        >
          {/* Day-of-week header */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_NAMES_SHORT.map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-2 -mt-2">
            {Array.from({ length: startDayOfMonth }).map((_, i) => (
              <div key={`pad-start-${i}`} className="p-2" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected =
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

              const events   = getEventsForDate(year, month, day, customEvents);
              const dotTypes = [...new Set(events.map(e => e.type))].slice(0, 3) as EventType[];

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(new Date(year, month, day))}
                  className={`min-h-15 p-2 rounded-[16px] border transition-all flex flex-col relative group cursor-pointer
                    ${isSelected
                      ? 'border-(--color-ink) bg-(--color-ink) text-white shadow-md scale-[1.02]'
                      : 'border-transparent bg-(--color-surface) hover:bg-gray-200'
                    }`}
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

            {Array.from({ length: trailingPad }).map((_, i) => (
              <div key={`pad-end-${i}`} className="p-2" />
            ))}
          </div>
        </CardContent>

        {/* Selected day — event count + add button */}
        <CardContent
          iconName="event"
          title={`${getDayLabel(selectedDate)}, ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
          action={
            <ButtonIcon
              iconName="add"
              aria-label="Add event"
              clickHandler={() => setAddModalOpen(true)}
            />
          }
        >
          {selectedEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <MaterialIcon name="event_busy" size={32} className="text-gray-200" />
              <p className="text-sm text-gray-400 font-medium">No events on this day</p>
              <button
                onClick={() => setAddModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors"
              >
                <MaterialIcon name="add_circle" size={14} />
                Add an event
              </button>
            </div>
          ) : (
            <div className="px-4 md:px-6 py-4 flex flex-col gap-3">
              {/* Summary count */}
              <div className="flex items-center gap-3 py-3 px-4 rounded-[14px] bg-(--color-surface-alt)">
                <MaterialIcon name="info" size={16} className="text-gray-400 shrink-0" />
                <p className="text-sm text-gray-600 font-medium">
                  <span className="font-bold text-(--color-ink)">{selectedEvents.length}</span>
                  {' '}event{selectedEvents.length !== 1 ? 's' : ''} scheduled on this day.
                </p>
              </div>

              {/* Type breakdown — dots + label only, no event titles */}
              <div className="flex flex-wrap gap-2 mt-1">
                {(Object.entries(
                  selectedEvents.reduce<Record<string, number>>((acc, e) => {
                    acc[e.type] = (acc[e.type] ?? 0) + 1;
                    return acc;
                  }, {}),
                ) as [EventType, number][]).map(([type, count]) => {
                  const cfg = EVENT_TYPE_CONFIG[type];
                  return (
                    <div
                      key={type}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-[10px] text-[11px] font-semibold ${cfg.bgClass} ${cfg.textClass}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
                      {cfg.label}
                      {count > 1 && <span className="font-bold">×{count}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>

      </div>

      {/* Add event modal — events go to shared store and are visible in admin */}
      {addModalOpen && (
        <AddEventModal
          date={selectedDate}
          onAdd={(event, date) => { addEvent(event, date); }}
          onClose={() => setAddModalOpen(false)}
        />
      )}
    </UserLayout>
  );
};

export default UserCalendar;
