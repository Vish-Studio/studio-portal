import { create } from "zustand";
import type { ScheduleEvent } from "../components/admin/schedule/event-types";

const dateKey = (year: number, month: number, day: number) =>
  `${year}-${month}-${day}`;

interface CalendarState {
  customEvents: Record<string, ScheduleEvent[]>;
  addEvent: (event: ScheduleEvent, eventDate: Date) => void;
  editEvent: (event: ScheduleEvent, newDate: Date) => void;
  removeEvent: (eventId: string) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  customEvents: {},

  addEvent: (event: ScheduleEvent, eventDate: Date) => {
    const key = dateKey(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
    );
    set((state) => ({
      customEvents: {
        ...state.customEvents,
        [key]: [...(state.customEvents[key] ?? []), event],
      },
    }));
  },

  editEvent: (event: ScheduleEvent, newDate: Date) => {
    const newKey = dateKey(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
    );
    set((state) => {
      const newEvents = { ...state.customEvents };

      // Remove the event from all dates (it might have moved to a different date)
      Object.keys(newEvents).forEach((key) => {
        newEvents[key] = newEvents[key].filter((e) => e.id !== event.id);
        if (newEvents[key].length === 0) delete newEvents[key];
      });

      // Add the updated event to the new date
      newEvents[newKey] = [...(newEvents[newKey] ?? []), event];

      return { customEvents: newEvents };
    });
  },

  removeEvent: (eventId: string) => {
    set((state) => {
      const newEvents = { ...state.customEvents };
      Object.keys(newEvents).forEach((key) => {
        newEvents[key] = newEvents[key].filter((e) => e.id !== eventId);
        if (newEvents[key].length === 0) delete newEvents[key];
      });
      return { customEvents: newEvents };
    });
  },
}));
