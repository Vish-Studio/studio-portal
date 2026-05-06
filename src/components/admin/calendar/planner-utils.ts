import type { ScheduleEvent } from '../schedule/event-types';

export type PlannerEventMap = Record<string, ScheduleEvent[]>;

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const getDateKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

export const isSameDate = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const getDateEvents = (date: Date, events: PlannerEventMap) =>
  [...(events[getDateKey(date)] ?? [])].sort((a, b) => a.time.localeCompare(b.time));

export const getMonthDays = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = new Date(year, month, 1).getDay();
  const days: Array<Date | null> = [];

  for (let i = 0; i < startOffset; i += 1) days.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) days.push(new Date(year, month, day));
  while (days.length % 7 !== 0) days.push(null);

  return days;
};

export const getMonthEventCount = (date: Date, events: PlannerEventMap): number => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }).reduce<number>((total, _, index) => {
    return total + getDateEvents(new Date(year, month, index + 1), events).length;
  }, 0);
};

export const getWeekEventCount = (date: Date, events: PlannerEventMap): number => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());

  return Array.from({ length: 7 }).reduce<number>((total, _, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return total + getDateEvents(day, events).length;
  }, 0);
};

export const formatDateLine = (date: Date) =>
  date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

export const getVisibleWeek = (date: Date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
};
