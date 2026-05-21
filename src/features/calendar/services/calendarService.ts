import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  where,
  query,
  type FirestoreError,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { requireFirebase } from '@/src/firebase/requireFirebase';
import type { AuthProfile, AuthRole } from '@/src/types/auth';
import type { EventType, ScheduleCategory, ScheduleEvent } from '../components/schedule/event-types';
import { getEventCategory } from '../components/schedule/event-types';

const collectionName = 'calendar';

export interface CalendarEventInput {
  event: ScheduleEvent;
  date: Date;
  profile: AuthProfile;
}

const dateKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

export const canCreateCalendarCategory = (role: AuthRole | null | undefined, category: ScheduleCategory) => {
  if (role === 'superadmin' || role === 'admin') return true;
  if (role === 'freelancer' || role === 'team') return category === 'team';
  return false;
};

export const getAllowedCalendarCategories = (role: AuthRole | null | undefined): ScheduleCategory[] => {
  if (role === 'superadmin' || role === 'admin') return ['team', 'project', 'client'];
  if (role === 'freelancer' || role === 'team') return ['team'];
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

  return endTime ? `${formatTime(startTime)} – ${formatTime(endTime)}` : formatTime(startTime);
};

const toDate = (value: unknown): Date | undefined => {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return undefined;
};

const calendarEventFromDoc = (snapshot: QueryDocumentSnapshot): ScheduleEvent => {
  const data = snapshot.data();
  const category = data.category as ScheduleCategory | undefined;
  const allDay = data.allDay !== false;
  const startTime = typeof data.startTime === 'string' ? data.startTime : undefined;
  const endTime = typeof data.endTime === 'string' ? data.endTime : undefined;

  return {
    id: snapshot.id,
    category,
    type: data.type as EventType,
    title: String(data.title ?? 'Untitled event'),
    time: typeof data.time === 'string' ? data.time : toDisplayTime(allDay, startTime, endTime),
    date: toDate(data.date),
    allDay,
    startTime,
    endTime,
    callLink: typeof data.callLink === 'string' && data.callLink ? data.callLink : undefined,
    description: typeof data.description === 'string' && data.description ? data.description : undefined,
    createdById: String(data.createdById ?? ''),
    createdByName: typeof data.createdByName === 'string' ? data.createdByName : undefined,
    createdByRole: typeof data.createdByRole === 'string' ? data.createdByRole : undefined,
    invitees: Array.isArray(data.invitees) ? data.invitees.filter((value): value is string => typeof value === 'string') : [],
    projectId: typeof data.projectId === 'string' && data.projectId ? data.projectId : undefined,
    phaseId: typeof data.phaseId === 'string' && data.phaseId ? data.phaseId : undefined,
    clientId: typeof data.clientId === 'string' && data.clientId ? data.clientId : undefined,
    memberIds: Array.isArray(data.memberIds) ? data.memberIds.filter((value): value is string => typeof value === 'string') : undefined,
  };
};

const toFirestoreEvent = ({ event, date, profile }: CalendarEventInput) => {
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
    category,
    type: event.type,
    title: event.title.trim(),
    time: toDisplayTime(allDay, event.startTime, event.endTime, event.time),
    date: Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth(), date.getDate())),
    allDay,
    startTime: event.startTime ?? '',
    endTime: event.endTime ?? '',
    callLink: event.callLink?.trim() ?? '',
    description: event.description?.trim() ?? '',
    createdById: profile.uid,
    createdByName: profile.fullName,
    createdByRole: profile.role,
    invitees,
    projectId: category === 'project' ? event.projectId ?? '' : '',
    phaseId: category === 'project' ? event.phaseId ?? '' : '',
    clientId: category === 'client' || category === 'project' ? event.clientId ?? '' : '',
    memberIds: category === 'team' || category === 'project' ? event.memberIds ?? [] : [],
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

export const calendarService = {
  subscribeToEvents(
    profile: AuthProfile,
    onEvents: (events: ScheduleEvent[]) => void,
    onError: (error: FirestoreError) => void,
  ): Unsubscribe {
    const eventsQuery = profile.role === 'superadmin' || profile.role === 'admin'
      ? collection(requireFirebase().db, collectionName)
      : query(collection(requireFirebase().db, collectionName), where('invitees', 'array-contains', profile.uid));

    return onSnapshot(
      eventsQuery,
      snapshot => onEvents(snapshot.docs.map(calendarEventFromDoc)),
      onError,
    );
  },

  async createEvent(input: CalendarEventInput): Promise<void> {
    await addDoc(collection(requireFirebase().db, collectionName), {
      ...toFirestoreEvent(input),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async updateEvent(eventId: string, input: CalendarEventInput): Promise<void> {
    await updateDoc(doc(requireFirebase().db, collectionName, eventId), {
      ...toFirestoreEvent(input),
      updatedAt: serverTimestamp(),
    });
  },

  async deleteEvent(eventId: string): Promise<void> {
    await deleteDoc(doc(requireFirebase().db, collectionName, eventId));
  },
};
