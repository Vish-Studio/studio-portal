import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, startOfDay } from 'date-fns';
import { type ScheduleEvent, type EventType, ALL_EVENT_TYPES, EVENT_TYPE_CONFIG } from './event-types';
import MaterialIcon from '../../common/material-icon/material-icon';
import FormSidebar, { FormSidebarFooter } from '../../common/form-sidebar/form-sidebar';
import Select from '../../common/select/select';
import Option from '../../common/select/option';
import Avatar from '../../common/avatar/avatar';
import Button from '../../common/button/button';
import { useProjectsStore } from '@/src/store/projects';
import { useClientsStore } from '@/src/store/clients';
import { useTeamStore } from '@/src/store/team';

const toDisplayTime = (time: string) => {
  if (!time) return '';
  const [hour, minute] = time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${period}`;
};

const parseTimeFromDisplay = (displayTime: string) => {
  if (!displayTime || displayTime === 'All Day') return '';
  const match = displayTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return '';
  let hour = Number(match[1]);
  const minute = match[2];
  const period = match[3].toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return `${String(hour).padStart(2, '0')}:${minute}`;
};

const toDateInputValue = (date: Date) => format(date, 'yyyy-MM-dd');

const fromDateInputValue = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return startOfDay(new Date(year, month - 1, day));
};

const projectTypes: EventType[] = [
  'discovery',
  'brief',
  'revision',
  'design-review',
  'qa-test',
  'launch',
  'client-feedback',
  'phase-call',
];

const clientTypes: EventType[] = [...projectTypes, 'client-meeting', 'onboarding'];
const meetingTypes: EventType[] = ['team-meeting', 'client-meeting', 'phase-call'];
const teamTypes: EventType[] = [...meetingTypes, 'admin-task'];

interface AddEventModalProps {
  date: Date;
  onAdd: (event: ScheduleEvent, date: Date) => void;
  onClose: () => void;
  initialEvent?: ScheduleEvent;
}

export default function AddEventModal({ date, onAdd, onClose, initialEvent }: AddEventModalProps) {
  const [selectedDate, setSelectedDate] = useState(startOfDay(date));
  const [selectedType, setSelectedType] = useState<EventType>(initialEvent?.type ?? 'brief');
  const [title, setTitle] = useState(initialEvent?.title ?? '');
  const [description, setDescription] = useState(initialEvent?.description ?? '');
  const [callLink, setCallLink] = useState(initialEvent?.callLink ?? '');
  const [allDay, setAllDay] = useState(!initialEvent || initialEvent.time === 'All Day');

  const timeParts = initialEvent?.time && initialEvent.time !== 'All Day'
    ? initialEvent.time.split(' – ')
    : [];
  const [startTime, setStartTime] = useState(parseTimeFromDisplay(timeParts[0] ?? ''));
  const [endTime, setEndTime] = useState(parseTimeFromDisplay(timeParts[1] ?? ''));

  const { projects } = useProjectsStore();
  const { clients } = useClientsStore();
  const { members } = useTeamStore();

  const [linkedProjectId, setLinkedProjectId] = useState(initialEvent?.projectId ?? '');
  const [linkedPhaseId, setLinkedPhaseId] = useState(initialEvent?.phaseId ?? '');
  const [linkedClientId, setLinkedClientId] = useState(initialEvent?.clientId ?? '');
  const [linkedMemberIds, setLinkedMemberIds] = useState<string[]>(initialEvent?.memberIds ?? []);

  const config = EVENT_TYPE_CONFIG[selectedType];
  const linkedProject = projects.find(project => project.id === linkedProjectId);
  const showProject = projectTypes.includes(selectedType);
  const showClient = clientTypes.includes(selectedType);
  const showTeam = teamTypes.includes(selectedType);
  const showCallLink = meetingTypes.includes(selectedType);

  const handleTypeChange = (type: EventType) => {
    setSelectedType(type);
    if (!projectTypes.includes(type)) {
      setLinkedProjectId('');
      setLinkedPhaseId('');
    }
    if (!clientTypes.includes(type)) {
      setLinkedClientId('');
    }
    if (!teamTypes.includes(type)) {
      setLinkedMemberIds([]);
    }
    if (!meetingTypes.includes(type)) {
      setCallLink('');
    }
  };

  const handleProjectChange = (projectId: string) => {
    setLinkedProjectId(projectId);
    setLinkedPhaseId('');

    const project = projects.find(item => item.id === projectId);
    if (project && !linkedClientId) setLinkedClientId(project.clientId);
  };

  const toggleMember = (memberId: string) => {
    setLinkedMemberIds(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId],
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    let time = 'All Day';
    if (!allDay && startTime) {
      time = endTime
        ? `${toDisplayTime(startTime)} – ${toDisplayTime(endTime)}`
        : toDisplayTime(startTime);
    }

    onAdd(
      {
        id: initialEvent?.id ?? uuidv4(),
        type: selectedType,
        title: title.trim(),
        time,
        callLink: callLink.trim() || undefined,
        description: description.trim() || undefined,
        projectId: linkedProjectId || undefined,
        phaseId: linkedPhaseId || undefined,
        clientId: linkedClientId || undefined,
        memberIds: linkedMemberIds.length ? linkedMemberIds : undefined,
      },
      selectedDate,
    );
    onClose();
  };

  return (
    <FormSidebar
      isOpen
      onClose={onClose}
      title={initialEvent ? 'Edit schedule' : 'Add schedule'}
      description={format(selectedDate, 'EEEE, MMMM d, yyyy')}
      width="md"
    >
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-5 rounded-[18px] bg-(--color-surface-alt) p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-(--color-ink)">
                <MaterialIcon name={config.icon} size={19} fill />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-(--color-ink)">{config.label}</p>
                <p className="text-xs font-semibold text-gray-400">
                  {format(selectedDate, 'EEE, d MMM yyyy')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Title</p>
              <input
                type="text"
                value={title}
                onChange={event => setTitle(event.target.value)}
                placeholder={`e.g. ${config.label} with Acme Corp`}
                autoFocus
                className="w-full rounded-2xl border border-transparent bg-(--color-surface) px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-gray-200 focus:bg-white focus:ring-4 focus:ring-gray-100"
              />
            </div>

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</p>
              <Select
                value={selectedType}
                onChange={event => handleTypeChange(event.target.value as EventType)}
                className="rounded-2xl bg-(--color-surface) font-semibold"
              >
                {ALL_EVENT_TYPES.map(type => (
                  <Option key={type} value={type}>
                    {EVENT_TYPE_CONFIG[type].label}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date and time</p>
              <div className="rounded-2xl bg-(--color-surface) p-3">
                <input
                  type="date"
                  value={toDateInputValue(selectedDate)}
                  onChange={event => setSelectedDate(fromDateInputValue(event.target.value))}
                  className="w-full rounded-xl border border-transparent bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:border-gray-200 focus:ring-4 focus:ring-gray-100"
                />

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">All day</span>
                  <button
                    type="button"
                    onClick={() => setAllDay(value => !value)}
                    className={`relative h-5 w-9 rounded-full transition-colors ${allDay ? 'bg-(--color-ink)' : 'bg-gray-300'}`}
                    aria-pressed={allDay}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${allDay ? 'translate-x-4' : 'translate-x-0.5'}`}
                    />
                  </button>
                </div>

                {!allDay && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <input
                      type="time"
                      value={startTime}
                      onChange={event => setStartTime(event.target.value)}
                      className="min-w-0 rounded-xl border border-transparent bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:border-gray-200 focus:ring-4 focus:ring-gray-100"
                    />
                    <input
                      type="time"
                      value={endTime}
                      onChange={event => setEndTime(event.target.value)}
                      className="min-w-0 rounded-xl border border-transparent bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:border-gray-200 focus:ring-4 focus:ring-gray-100"
                    />
                  </div>
                )}
              </div>
            </div>

            {showCallLink && (
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Call link</p>
                <input
                  type="url"
                  value={callLink}
                  onChange={event => setCallLink(event.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full rounded-2xl border border-transparent bg-(--color-surface) px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-gray-200 focus:bg-white focus:ring-4 focus:ring-gray-100"
                />
              </div>
            )}

            {(showProject || showClient || showTeam) && (
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Assignments</p>
                <div className="space-y-3 rounded-2xl bg-(--color-surface) p-3">
                  {showProject && (
                    <>
                      <Select
                        value={linkedProjectId}
                        onChange={event => handleProjectChange(event.target.value)}
                        className="rounded-xl bg-white font-medium"
                      >
                        <Option value="">No project</Option>
                        {projects.map(project => (
                          <Option key={project.id} value={project.id}>{project.name}</Option>
                        ))}
                      </Select>

                      {linkedProject && (
                        <Select
                          value={linkedPhaseId}
                          onChange={event => setLinkedPhaseId(event.target.value)}
                          className="rounded-xl bg-white font-medium"
                        >
                          <Option value="">No phase</Option>
                          {linkedProject.phases.map(phase => (
                            <Option key={phase.id} value={phase.id}>{phase.title}</Option>
                          ))}
                        </Select>
                      )}
                    </>
                  )}

                  {showClient && (
                    <Select
                      value={linkedClientId}
                      onChange={event => setLinkedClientId(event.target.value)}
                      className="rounded-xl bg-white font-medium"
                    >
                      <Option value="">No client</Option>
                      {clients.map(client => (
                        <Option key={client.id} value={client.id}>
                          {client.displayName}{client.companyName ? ` - ${client.companyName}` : ''}
                        </Option>
                      ))}
                    </Select>
                  )}

                  {showTeam && (
                    <div className="flex flex-wrap gap-2">
                      {members.map(member => {
                        const active = linkedMemberIds.includes(member.id);

                        return (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => toggleMember(member.id)}
                            className={`flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                              active
                                ? 'border-(--color-ink) bg-(--color-ink) text-white'
                                : 'border-transparent bg-white text-gray-600 hover:border-gray-200'
                            }`}
                          >
                            <Avatar name={member.name} id={member.id} size="xs" />
                            {member.name.split(' ')[0]}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Notes</p>
              <textarea
                value={description}
                onChange={event => setDescription(event.target.value)}
                rows={3}
                placeholder="Add agenda, notes, or preparation details..."
                className="w-full resize-none rounded-2xl border border-transparent bg-(--color-surface) px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-gray-200 focus:bg-white focus:ring-4 focus:ring-gray-100"
              />
            </div>
          </div>
        </div>

        <FormSidebarFooter>
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!title.trim()}
            className="flex-[1.4]"
            iconLeft={<MaterialIcon name={initialEvent ? 'edit' : 'add'} size={16} className="text-white" />}
          >
            {initialEvent ? 'Update schedule' : 'Add schedule'}
          </Button>
        </FormSidebarFooter>
      </form>
    </FormSidebar>
  );
}
