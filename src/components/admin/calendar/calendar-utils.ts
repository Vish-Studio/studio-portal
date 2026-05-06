import { getEventsForDate } from '@/src/data/calendar';
import type { ScheduleEvent } from '../schedule/event-types';

export type CalendarEventMap = Record<string, ScheduleEvent[]>;

export const parseTimeToMinutes = (time: string) => {
  if (time === 'All Day') return -1;
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return 1440;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

export const sortEventsByTime = (events: ScheduleEvent[]) =>
  [...events].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

export const isSameDay = (a: Date, b: Date) =>
  a.getDate() === b.getDate() &&
  a.getMonth() === b.getMonth() &&
  a.getFullYear() === b.getFullYear();

export const getDayEvents = (date: Date, customEvents: CalendarEventMap) =>
  sortEventsByTime(getEventsForDate(date.getFullYear(), date.getMonth(), date.getDate(), customEvents));

export const formatPlannerDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

export const getMonthEventCount = (year: number, month: number, daysInMonth: number, customEvents: CalendarEventMap) =>
  Array.from({ length: daysInMonth }, (_, index) => index + 1)
    .reduce((total, day) => total + getDayEvents(new Date(year, month, day), customEvents).length, 0);
