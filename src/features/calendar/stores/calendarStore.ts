import { create } from "zustand";
import type { ScheduleEvent } from "../components/schedule/event-types";
import type { AuthProfile } from "@/src/types/auth";
import { calendarService, groupCalendarEventsByDate } from "../services/calendarService";

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

export const useCalendarStore = create<CalendarState>((set) => ({
  customEvents: {},
  loading: false,
  error: null,

  subscribeToEvents: (profile) => {
    set({ loading: true, error: null });
    return calendarService.subscribeToEvents(
      profile,
      events => set({
        customEvents: groupCalendarEventsByDate(events),
        loading: false,
        error: null,
      }),
      error => set({ customEvents: {}, loading: false, error: error.message }),
    );
  },

  addEvent: async (event, eventDate, profile) => {
    set({ error: null });
    await calendarService.createEvent({ event, date: eventDate, profile });
  },

  editEvent: async (event, newDate, profile) => {
    set({ error: null });
    await calendarService.updateEvent(event.id, { event, date: newDate, profile });
  },

  removeEvent: async (eventId) => {
    set({ error: null });
    await calendarService.deleteEvent(eventId);
  },

  clearEvents: () => set({ customEvents: {}, loading: false, error: null }),
}));
