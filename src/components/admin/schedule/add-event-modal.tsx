import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addDays, format, isSameDay, startOfDay } from 'date-fns';
import { type ScheduleEvent, type EventType, ALL_EVENT_TYPES, EVENT_TYPE_CONFIG } from './event-types';
import MaterialIcon from '../../common/material-icon/material-icon';
import FormSidebar, { FormSidebarFooter } from '../../common/form-sidebar/form-sidebar';
import Select from '../../../components/common/select/select';
import Option from '../../../components/common/select/option';
import Avatar from '../../common/avatar/avatar';
import Button from '../../common/button/button';
import { useProjectsStore } from '@/src/store/projects';
import { useClientsStore } from '@/src/store/clients';
import { useTeamStore } from '@/src/store/team';

// ─── Time helpers ─────────────────────────────────────────────────────────────

const toDisplayTime = (t: string) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${period}`;
};

const parseTimeFromDisplay = (displayTime: string): string => {
  if (!displayTime || displayTime === 'All Day') return '';
  const match = displayTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return '';
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const meridiem = match[3].toUpperCase();
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddEventModalProps {
  date: Date;
  onAdd: (event: ScheduleEvent, date: Date) => void;
  onClose: () => void;
  initialEvent?: ScheduleEvent;
}

// ─── AddEventModal ────────────────────────────────────────────────────────────

export default function AddEventModal({ date, onAdd, onClose, initialEvent }: AddEventModalProps) {
  const today = startOfDay(new Date());
  const [selectedDate, setSelectedDate] = useState(startOfDay(date));
  const [selectedType, setSelectedType] = useState<EventType>(initialEvent?.type ?? 'brief');
  const [title, setTitle] = useState(initialEvent?.title ?? '');
  const [description, setDescription] = useState(initialEvent?.description ?? '');
  const [callLink, setCallLink] = useState(initialEvent?.callLink ?? '');

  const isAllDay = !initialEvent || initialEvent.time === 'All Day';
  const [allDay, setAllDay] = useState(isAllDay);

  let initialStartTime = '';
  let initialEndTime = '';
  if (initialEvent && initialEvent.time !== 'All Day') {
    const timeParts = initialEvent.time.split(' – ');
    initialStartTime = parseTimeFromDisplay(timeParts[0]);
    initialEndTime = timeParts[1] ? parseTimeFromDisplay(timeParts[1]) : '';
  }
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);

  // ── Entity links ──
  const { projects } = useProjectsStore();
  const { clients } = useClientsStore();
  const { members } = useTeamStore();

  const [linkedProjectId, setLinkedProjectId] = useState(initialEvent?.projectId ?? '');
  const [linkedPhaseId, setLinkedPhaseId] = useState(initialEvent?.phaseId ?? '');
  const [linkedClientId, setLinkedClientId] = useState(initialEvent?.clientId ?? '');
  const [linkedMemberIds, setLinkedMemberIds] = useState<string[]>(initialEvent?.memberIds ?? []);
  const [showLinks, setShowLinks] = useState(
    selectedType === 'phase-call' ||
    selectedType === 'client-meeting' ||
    !!(initialEvent?.projectId || initialEvent?.phaseId || initialEvent?.clientId || initialEvent?.memberIds?.length),
  );

  const stripRef = useRef<HTMLDivElement>(null);
  const activeDateRef = useRef<HTMLButtonElement>(null);
  const dateRange = Array.from({ length: 26 }, (_, i) => addDays(today, i - 5));

  useEffect(() => {
    activeDateRef.current?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, []);

  const config = EVENT_TYPE_CONFIG[selectedType];
  const linkedProject = projects.find(p => p.id === linkedProjectId);

  const toggleMember = (id: string) =>
    setLinkedMemberIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleTypeChange = (type: EventType) => {
    setSelectedType(type);
    if (type === 'phase-call' || type === 'client-meeting' || type === 'admin-focus' || type === 'admin-task') {
      setShowLinks(true);
    }
  };

  const handleProjectChange = (projectId: string) => {
    setLinkedProjectId(projectId);
    setLinkedPhaseId('');
    const project = projects.find(p => p.id === projectId);
    if (project && !linkedClientId) setLinkedClientId(project.clientId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      title={initialEvent ? 'Edit Event' : 'New Event'}
      description={format(selectedDate, 'EEEE, MMMM d · yyyy')}
      width="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          <div className={`flex items-center gap-3 rounded-2xl ${config.iconBgClass} px-4 py-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.textClass} bg-white/60`}>
              <MaterialIcon name={config.icon} size={20} fill />
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-bold ${config.textClass}`}>{config.label}</p>
              <p className={`text-xs font-semibold ${config.textClass} opacity-60`}>{format(selectedDate, 'EEEE, MMMM d · yyyy')}</p>
            </div>
          </div>

        {/* Title */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Title</p>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={`e.g. ${config.label} with Acme Corp`}
            autoFocus
            className="w-full px-4 py-3 bg-(--color-surface) border border-transparent rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-300 outline-none focus:border-gray-200 focus:ring-2 focus:ring-gray-100 transition-all"
          />
        </div>

        {/* Time */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</p>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <div
                onClick={() => setAllDay(v => !v)}
                className={`w-8 h-4.5 rounded-full relative transition-colors cursor-pointer ${allDay ? 'bg-(--color-ink)' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${allDay ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-xs font-semibold text-gray-500">All day</span>
            </label>
          </div>
          <div className={`flex items-center gap-2 transition-opacity ${allDay ? 'opacity-30 pointer-events-none' : ''}`}>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="flex-1 px-4 py-3 bg-(--color-surface) border border-transparent rounded-2xl text-sm font-medium text-gray-900 outline-none focus:border-gray-200 focus:ring-2 focus:ring-gray-100 transition-all"
            />
            <span className="text-xs font-bold text-gray-300 shrink-0">→</span>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="flex-1 px-4 py-3 bg-(--color-surface) border border-transparent rounded-2xl text-sm font-medium text-gray-900 outline-none focus:border-gray-200 focus:ring-2 focus:ring-gray-100 transition-all"
            />
          </div>
        </div>

        {/* Date strip */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">When</p>
          <div ref={stripRef} className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            {dateRange.map(d => {
              const isActive = isSameDay(d, selectedDate);
              const isToday_ = isSameDay(d, today);
              return (
                <button
                  key={d.toISOString()}
                  ref={isActive ? activeDateRef : undefined}
                  type="button"
                  onClick={() => setSelectedDate(d)}
                  className={`flex flex-col items-center gap-0.5 min-w-11 py-2.5 rounded-2xl shrink-0 transition-all
                    ${isActive ? 'bg-(--color-ink) text-white shadow-sm' : 'bg-(--color-surface) text-gray-600 hover:bg-gray-200'}`}
                >
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-white/60' : isToday_ ? 'text-blue-500' : 'text-gray-400'}`}>
                    {format(d, 'EEE')}
                  </span>
                  <span className={`text-sm font-bold leading-none ${isActive ? 'text-white' : isToday_ ? 'text-blue-600' : 'text-gray-800'}`}>
                    {format(d, 'd')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Event type grid */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Type</p>
          <div className="grid grid-cols-4 gap-2">
            {ALL_EVENT_TYPES.map(type => {
              const c = EVENT_TYPE_CONFIG[type];
              const isActive = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl transition-all border
                    ${isActive ? 'bg-(--color-ink) border-(--color-ink) shadow-sm' : `${c.bgClass} border-transparent hover:border-gray-200`}`}
                >
                  <MaterialIcon
                    name={c.icon}
                    size={20}
                    fill={isActive}
                    className={isActive ? 'text-white' : c.textClass}
                  />
                  <span className={`text-[9px] font-bold leading-none tracking-tight text-center ${isActive ? 'text-white/80' : c.textClass}`}>
                    {c.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Call Link */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Call Link (Optional)</p>
          <input
            type="url"
            value={callLink}
            onChange={e => setCallLink(e.target.value)}
            placeholder="https://meet.google.com/…"
            className="w-full px-4 py-3 bg-(--color-surface) border border-transparent rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-300 outline-none focus:border-gray-200 focus:ring-2 focus:ring-gray-100 transition-all"
          />
        </div>

        {/* ── Entity links (collapsible) ── */}
        <div>
          <button
            type="button"
            onClick={() => setShowLinks(v => !v)}
            className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
          >
            <MaterialIcon name={showLinks ? 'expand_less' : 'expand_more'} size={14} />
            Link Project, Client or Team
          </button>

          {showLinks && (
            <div className="mt-3 flex flex-col gap-4">

              {/* Project */}
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Project</p>
                <Select
                  value={linkedProjectId}
                  onChange={e => handleProjectChange(e.target.value)}
                  className="bg-(--color-surface) border-transparent rounded-2xl py-2.5 font-medium focus:ring-0 focus:bg-(--color-surface)"
                >
                  <Option value="">— None —</Option>
                  {projects.map(p => (
                    <Option key={p.id} value={p.id}>{p.name}</Option>
                  ))}
                </Select>
              </div>

              {linkedProject && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Project phase</p>
                  <Select
                    value={linkedPhaseId}
                    onChange={e => setLinkedPhaseId(e.target.value)}
                    className="bg-(--color-surface) border-transparent rounded-2xl py-2.5 font-medium focus:ring-0 focus:bg-(--color-surface)"
                  >
                    <Option value="">— None —</Option>
                    {linkedProject.phases.map(phase => (
                      <Option key={phase.id} value={phase.id}>{phase.title}</Option>
                    ))}
                  </Select>
                </div>
              )}

              {/* Client */}
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Client</p>
                <Select
                  value={linkedClientId}
                  onChange={e => setLinkedClientId(e.target.value)}
                  className="bg-(--color-surface) border-transparent rounded-2xl py-2.5 font-medium focus:ring-0 focus:bg-(--color-surface)"
                >
                  <Option value="">— None —</Option>
                  {clients.map(c => (
                    <Option key={c.id} value={c.id}>{c.displayName}{c.companyName ? ` · ${c.companyName}` : ''}</Option>
                  ))}
                </Select>
              </div>

              {/* Team members */}
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Assign Team Members</p>
                <div className="flex flex-wrap gap-2">
                  {members.map(m => {
                    const active = linkedMemberIds.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleMember(m.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${active
                            ? 'bg-(--color-ink) text-white border-(--color-ink)'
                            : 'bg-(--color-surface) text-gray-600 border-transparent hover:border-gray-300'
                          }`}
                      >
                        <Avatar name={m.name} id={m.id} size="xs" />
                        {m.name.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Notes (Optional)</p>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Add any notes or agenda…"
                  className="w-full px-4 py-3 bg-(--color-surface) border border-transparent rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-300 outline-none focus:border-gray-200 focus:ring-2 focus:ring-gray-100 transition-all resize-none"
                />
              </div>

            </div>
          )}
        </div>

        </div>

        {/* Submit */}
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
            className="flex-2"
            iconLeft={<MaterialIcon name={initialEvent ? 'edit' : 'add'} size={16} className="text-white" />}
          >
            {initialEvent ? 'Update Event' : 'Add Event'}
          </Button>
        </FormSidebarFooter>

      </form>
    </FormSidebar>
  );
}
