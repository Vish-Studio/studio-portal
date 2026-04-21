import React from 'react';
import { Phone, Video, Briefcase, Calendar as CalendarIcon } from 'lucide-react';

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export interface ScheduleEvent {
  type: 'call' | 'video' | 'project';
  title: string;
  time: string;
}

interface DailyScheduleProps {
  date: Date;
  events: ScheduleEvent[];
}

// bg - (--color - ink)

export default function DailySchedule({ date, events }: DailyScheduleProps) {
  const label = `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;

  return (
    <div className="daily-schedule rounded-[24px] p-6 shadow-[0_2px_12px_var(--color-shadow-subtle)] flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-1">{label}</h3>
      <p className="text-sm font-medium text-gray-500 mb-6">Daily Schedule</p>

      <div className="flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar">
        {events.length > 0 ? (
          events.map((event, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <div
                className={`mt-1 w-8 h-8 rounded-full flex shrink-0 items-center justify-center text-white
                  ${event.type === 'video' ? 'bg-blue-500' :
                    event.type === 'call' ? 'bg-indigo-500' : 'bg-pink-500'}`}
              >
                {event.type === 'video' ? <Video size={14} /> :
                  event.type === 'call' ? <Phone size={14} /> :
                    <Briefcase size={14} />}
              </div>
              <div>
                <h4 className="text-gray-900 font-bold text-sm tracking-tight">{event.title}</h4>
                <span className="text-gray-500 text-xs font-semibold">{event.time}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-10 opacity-60">
            <CalendarIcon size={32} className="text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-500">No events scheduled.</p>
            <p className="text-xs text-gray-400 mt-1">Enjoy your free day!</p>
          </div>
        )}
      </div>
    </div>
  );
}
