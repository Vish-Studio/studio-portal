import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, startOfDay } from 'date-fns';
import {
  type ScheduleEvent,
  type EventType,
  type ScheduleCategory,
  EVENT_TYPES_BY_CATEGORY,
  EVENT_TYPE_CONFIG,
  SCHEDULE_CATEGORY_CONFIG,
  getEventCategory,
} from './event-types';
import { Avatar, DatePicker, MaterialIcon, Toggle } from '@/src/shared/components';
import FormSidebar, { FormSidebarFooter } from '@/src/components/common/form-sidebar/form-sidebar';
import Select from '@/src/components/common/select/select';
import Option from '@/src/components/common/select/option';
import Button from '@/src/components/common/button/button';
import { useProjectsStore } from '@/src/features/projects';
import { useClientsStore } from '@/src/features/clients';
import { useTeamStore } from '@/src/features/team';
import { cn } from '@/src/lib/utils';

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

const scheduleCategories: ScheduleCategory[] = ['team', 'project', 'client'];

interface ScheduleSidebarFormProps {
  date: Date;
  onAdd: (event: ScheduleEvent, date: Date) => void;
  onClose: () => void;
  initialEvent?: ScheduleEvent;
}

export default function ScheduleSidebarForm({ date, onAdd, onClose, initialEvent }: ScheduleSidebarFormProps) {
  const [selectedDate, setSelectedDate] = useState(startOfDay(date));
  const initialCategory = initialEvent?.category ?? (initialEvent ? getEventCategory(initialEvent.type) : 'project');
  const [selectedCategory, setSelectedCategory] = useState<ScheduleCategory>(initialCategory);
  const [selectedType, setSelectedType] = useState<EventType>(
    initialEvent?.type ?? EVENT_TYPES_BY_CATEGORY[initialCategory][0],
  );
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
  const categoryConfig = SCHEDULE_CATEGORY_CONFIG[selectedCategory];
  const availableTypes = EVENT_TYPES_BY_CATEGORY[selectedCategory];
  const linkedProject = projects.find(project => project.id === linkedProjectId);
  const showProject = selectedCategory === 'project';
  const showClient = selectedCategory === 'client' || selectedCategory === 'project';
  const showTeam = selectedCategory === 'team';

  const handleCategoryChange = (category: ScheduleCategory) => {
    setSelectedCategory(category);
    const nextType = EVENT_TYPES_BY_CATEGORY[category][0];
    setSelectedType(nextType);

    if (category !== 'project') {
      setLinkedProjectId('');
      setLinkedPhaseId('');
    }
    if (category === 'team') {
      setLinkedClientId('');
    }
    if (category !== 'team') {
      setLinkedMemberIds([]);
    }
  };

  const handleTypeChange = (type: EventType) => {
    setSelectedType(type);
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
        category: selectedCategory,
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
      <form onSubmit={handleSubmit} className="schedule-sidebar-form flex min-h-0 flex-1 flex-col">
        <div className="schedule-sidebar-form-body flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/90 to-white px-6 py-5">
          <div className="schedule-sidebar-form-summary mb-5 overflow-hidden rounded-[22px] bg-(--color-ink) text-white">
            <div className="schedule-sidebar-form-summary-main flex items-start gap-3 p-5">
              <div className="schedule-sidebar-form-summary-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                <MaterialIcon name={categoryConfig.icon} size={20} fill />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/45">{categoryConfig.label} schedule</p>
                <p className="mt-1 text-lg font-bold leading-tight">{config.label}</p>
                <p className="mt-1 text-xs font-semibold text-white/50">
                  {format(selectedDate, 'EEEE, d MMM yyyy')} · {allDay ? 'All day' : startTime ? toDisplayTime(startTime) : 'No time set'}
                </p>
              </div>
            </div>
            <div className="schedule-sidebar-form-categories grid grid-cols-3 border-t border-white/10">
              {scheduleCategories.map(category => {
                const categoryItem = SCHEDULE_CATEGORY_CONFIG[category];
                const active = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={cn(
                      'schedule-sidebar-form-category flex items-center justify-center gap-2 px-3 py-3 text-xs font-bold transition-colors',
                      active ? 'bg-(--color-accent-lime) text-(--color-ink)' : 'text-white/55 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    <MaterialIcon name={categoryItem.icon} size={15} fill={active} />
                    {categoryItem.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="schedule-sidebar-form-sections space-y-4">
            <div className="schedule-sidebar-form-section rounded-[20px] border border-gray-100 bg-white p-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Title</p>
              <input
                type="text"
                value={title}
                onChange={event => setTitle(event.target.value)}
                placeholder={`e.g. ${config.label} with Acme Corp`}
                className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-gray-300 focus:bg-white focus:ring-4 focus:ring-gray-100"
              />
            </div>

            <div className="schedule-sidebar-form-section rounded-[20px] border border-gray-100 bg-white p-4">
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-surface-alt) text-(--color-ink)">
                  <MaterialIcon name={categoryConfig.icon} size={17} fill />
                </div>
                <div>
                  <p className="text-sm font-bold text-(--color-ink)">{categoryConfig.label}</p>
                  <p className="mt-0.5 text-xs font-medium leading-5 text-gray-400">{categoryConfig.description}</p>
                </div>
              </div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Schedule type</p>
              <Select
                value={selectedType}
                onChange={event => handleTypeChange(event.target.value as EventType)}
                className="rounded-2xl bg-gray-50 font-semibold"
              >
                {availableTypes.map(type => (
                  <Option key={type} value={type}>
                    {EVENT_TYPE_CONFIG[type].label}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="schedule-sidebar-form-section rounded-[20px] border border-gray-100 bg-white p-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date and time</p>
              <div className="rounded-2xl bg-gray-50 p-3">
                <DatePicker
                  value={toDateInputValue(selectedDate)}
                  onChange={event => setSelectedDate(fromDateInputValue(event.target.value))}
                  className="rounded-xl border-transparent bg-white"
                />

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">All day</span>
                  <Toggle checked={allDay} onChange={setAllDay} />
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

            <div className="schedule-sidebar-form-section rounded-[20px] border border-gray-100 bg-white p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Call link</p>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-400">Optional</span>
              </div>
              <div className="schedule-sidebar-form-call-link relative">
                <MaterialIcon name="link" size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="url"
                  value={callLink}
                  onChange={event => setCallLink(event.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-gray-300 focus:bg-white focus:ring-4 focus:ring-gray-100"
                />
              </div>
            </div>

            {(showProject || showClient || showTeam) && (
              <div className="schedule-sidebar-form-section rounded-[20px] border border-gray-100 bg-white p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Assignments</p>
                <div className="space-y-3 rounded-2xl bg-gray-50 p-3">
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
                          {client.fullName}{client.companyName ? ` - ${client.companyName}` : ''}
                        </Option>
                      ))}
                    </Select>
                  )}

                  {showTeam && (
                    <div className="schedule-sidebar-form-members flex flex-wrap gap-2">
                      {members.map(member => {
                        const active = linkedMemberIds.includes(member.id);

                        return (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => toggleMember(member.id)}
                            className={`schedule-sidebar-form-member flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
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

            <div className="schedule-sidebar-form-section rounded-[20px] border border-gray-100 bg-white p-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Notes</p>
              <textarea
                value={description}
                onChange={event => setDescription(event.target.value)}
                rows={3}
                placeholder="Add agenda, notes, or preparation details..."
                className="w-full resize-none rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-gray-300 focus:bg-white focus:ring-4 focus:ring-gray-100"
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
