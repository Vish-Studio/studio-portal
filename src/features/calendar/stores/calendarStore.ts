import { create } from "zustand";
import type { ScheduleEvent } from "../components/schedule/event-types";
import type { AuthProfile } from '@/src/features/auth';
import { groupCalendarEventsByDate, toLocalCalendarEvent } from "../services/calendarService";

interface CalendarState {
  customEvents: Record<string, ScheduleEvent[]>;
  loading: boolean;
  error: string | null;
  subscribeToEvents: (profile: AuthProfile) => () => void;
  addEvent: (event: ScheduleEvent, eventDate: Date, profile: AuthProfile) => Promise<void>;
  editEvent: (event: ScheduleEvent, newDate: Date, profile: AuthProfile) => Promise<void>;
  removeEvent: (eventId: string) => Promise<void>;
  clearEvents: () => void;
}

const localId = () => `event_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const flattenEvents = (groups: Record<string, ScheduleEvent[]>) => Object.values(groups).flat();

export const useCalendarStore = create<CalendarState>((set, get) => ({
  customEvents: {},
  loading: false,
  error: null,

  subscribeToEvents: () => {
    set({ loading: false, error: null });
    return () => undefined;
  },

  addEvent: async (event, eventDate, profile) => {
    set({ error: null });
    const nextEvent = toLocalCalendarEvent({ event: { ...event, id: event.id || localId() }, date: eventDate, profile });
    const events = [...flattenEvents(get().customEvents), nextEvent];
    set({ customEvents: groupCalendarEventsByDate(events) });
  },

  editEvent: async (event, newDate, profile) => {
    set({ error: null });
    const nextEvent = toLocalCalendarEvent({ event, date: newDate, profile });
    const events = flattenEvents(get().customEvents).map(item => item.id === event.id ? nextEvent : item);
    set({ customEvents: groupCalendarEventsByDate(events) });
  },

  removeEvent: async (eventId) => {
    set({ error: null });
    const events = flattenEvents(get().customEvents).filter(event => event.id !== eventId);
    set({ customEvents: groupCalendarEventsByDate(events) });
  },

  clearEvents: () => set({ customEvents: {}, loading: false, error: null }),
}));
