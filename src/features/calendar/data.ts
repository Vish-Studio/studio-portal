import type { ScheduleEvent, EventType } from './components/schedule/event-types';

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const DAY_NAMES_LONG = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export interface MockEventSeed {
  modulo: number;
  index: number;
  type: string;
  title: string;
  time: string;
}

export const MOCK_EVENT_SEEDS: MockEventSeed[] = [
  { modulo: 7,  index: 0, type: "brief",          title: "Strategy Sync",    time: "10:00 AM" },
  { modulo: 13, index: 1, type: "brief",          title: "Strategy Sync",    time: "10:00 AM" },
  { modulo: 5,  index: 2, type: "design-review",  title: "Product Review",   time: "1:00 PM"  },
  { modulo: 8,  index: 3, type: "launch",         title: "Web App Launch",   time: "All Day"  },
  { modulo: 19, index: 4, type: "client-feedback",title: "Client Feedback",  time: "3:00 PM"  },
];

export const TODAY_DEFAULT_EVENTS = [
  { idSuffix: "today-0", type: "onboarding",    title: "Acme Corp Kickoff",  time: "10:00 AM - 11:00 AM" },
  { idSuffix: "today-1", type: "design-review", title: "Design Review",      time: "01:30 PM - 02:00 PM" },
];

/** Generate deterministic mock events for a given calendar date. */
export const getMockEventsForDate = (
  year: number,
  month: number,
  day: number,
): ScheduleEvent[] => {
  const events: ScheduleEvent[] = [];
  const seed = year * 10000 + month * 100 + day;

  for (const s of MOCK_EVENT_SEEDS) {
    if (seed % s.modulo === 0) {
      events.push({
        id:    `mock-${seed}-${s.index}`,
        type:  s.type as EventType,
        title: s.title,
        time:  s.time,
      });
    }
  }

  const today = new Date();
  if (
    year === today.getFullYear() &&
    month === today.getMonth() &&
    day === today.getDate() &&
    events.length === 0
  ) {
    for (const e of TODAY_DEFAULT_EVENTS) {
      events.push({ id: e.idSuffix, type: e.type as EventType, title: e.title, time: e.time });
    }
  }

  return events;
};

/** Merge mock events with custom store events, respecting edits to mock events. */
export const getEventsForDate = (
  year: number,
  month: number,
  day: number,
  customEvents: Record<string, ScheduleEvent[]>,
): ScheduleEvent[] => {
  const key = `${year}-${month}-${day}`;
  const mock = getMockEventsForDate(year, month, day);
  const custom = customEvents[key] ?? [];

  // Collect all mock IDs that have been edited (exist in any custom bucket)
  const editedMockIds = new Set(
    Object.values(customEvents)
      .flat()
      .filter(e => e.id.startsWith('mock-'))
      .map(e => e.id),
  );

  return [...mock.filter(e => !editedMockIds.has(e.id)), ...custom];
};
