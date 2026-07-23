import type { AuthProfile, AuthRole } from '@/src/types/auth';
import type { ScheduleCategory, ScheduleEvent } from '../components/schedule/event-types';
import { getEventCategory } from '../components/schedule/event-types';

export interface CalendarEventInput {
  event: ScheduleEvent;
  date: Date;
  profile: AuthProfile;
}

const dateKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

export const canCreateCalendarCategory = (role: AuthRole | null | undefined, category: ScheduleCategory) => {
  if (role === 'superadmin' || role === 'admin') return true;
  return category === 'client';
};

export const getAllowedCalendarCategories = (role: AuthRole | null | undefined): ScheduleCategory[] => {
  if (role === 'superadmin' || role === 'admin') return ['team', 'project', 'client'];
  if (role === 'user') return ['client'];
  return [];
};

const unique = (values: Array<string | undefined | null>) =>
  Array.from(new Set(values.filter((value): value is string => Boolean(value))));

export const buildCalendarInvitees = (event: ScheduleEvent, profile: AuthProfile) => {
  const category = event.category ?? getEventCategory(event.type);

  if (category === 'team') {
    return unique([profile.uid, ...(event.memberIds ?? [])]);
  }

  if (category === 'client') {
    return unique([profile.uid, event.clientId]);
  }

  return unique([profile.uid, event.clientId, ...(event.memberIds ?? [])]);
};

const toDisplayTime = (allDay: boolean, startTime?: string, endTime?: string, fallback?: string) => {
  if (allDay) return 'All Day';
  if (!startTime) return fallback ?? 'All Day';

  const formatTime = (time: string) => {
    const [hourValue, minute = '00'] = time.split(':');
    let hour = Number(hourValue);
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute.padStart(2, '0')} ${period}`;
  };

  return endTime ? `${formatTime(startTime)} - ${formatTime(endTime)}` : formatTime(startTime);
};

export const toLocalCalendarEvent = ({ event, date, profile }: CalendarEventInput): ScheduleEvent => {
  const category = event.category ?? getEventCategory(event.type);

  if (!canCreateCalendarCategory(profile.role, category)) {
    throw new Error('You do not have permission to create this meeting type.');
  }

  if (category === 'team' && event.clientId) {
    throw new Error('Team meetings can only invite team members.');
  }

  if (category === 'client' && !event.clientId) {
    throw new Error('Client meetings require one client invitee.');
  }

  if (category === 'project' && !event.projectId) {
    throw new Error('Project meetings must be linked to a project.');
  }

  const invitees = buildCalendarInvitees(event, profile);
  if (invitees.length <= 1) {
    throw new Error('Choose at least one invitee for this meeting.');
  }

  const allDay = event.allDay ?? event.time === 'All Day';

  return {
    ...event,
    id: event.id,
    category,
    title: event.title.trim(),
    time: toDisplayTime(allDay, event.startTime, event.endTime, event.time),
    date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    allDay,
    callLink: event.callLink?.trim() || undefined,
    description: event.description?.trim() || undefined,
    createdById: profile.uid,
    createdByName: profile.fullName,
    createdByRole: profile.role,
    invitees,
    projectId: category === 'project' ? event.projectId : undefined,
    phaseId: category === 'project' ? event.phaseId : undefined,
    clientId: category === 'client' || category === 'project' ? event.clientId : undefined,
    memberIds: category === 'team' || category === 'project' ? event.memberIds ?? [] : undefined,
  };
};

export const groupCalendarEventsByDate = (events: ScheduleEvent[]) => (
  events.reduce<Record<string, ScheduleEvent[]>>((groups, event) => {
    if (!event.date) return groups;
    const key = dateKey(event.date);
    groups[key] = [...(groups[key] ?? []), event];
    return groups;
  }, {})
);
