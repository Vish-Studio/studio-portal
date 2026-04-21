import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Phone, Video, Briefcase } from 'lucide-react';

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Simple deterministic mock data generator so dates feel populated when traversing months
const getMockEventsForDate = (year: number, month: number, day: number) => {
  const events = [];
  const seed = year * 10000 + month * 100 + day;
  
  if (seed % 7 === 0 || seed % 13 === 0) {
    events.push({ type: 'call', title: 'Strategy Sync', time: '10:00 AM' });
  }
  if (seed % 5 === 0) {
    events.push({ type: 'video', title: 'Product Review', time: '1:00 PM' });
  }
  if (seed % 8 === 0) {
    events.push({ type: 'project', title: 'Web App Launch', time: 'All Day' });
  }
  if (seed % 19 === 0) {
    events.push({ type: 'call', title: 'Client Feedback', time: '3:00 PM' });
  }
  // Guarantee some events for today
  const today = new Date();
  if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
    if (events.length === 0) {
      events.push({ type: 'video', title: 'Acme Corp Kickoff', time: '10:00 AM - 11:00 AM' });
      events.push({ type: 'call', title: 'Design Review', time: '01:30 PM - 02:00 PM' });
    }
  }

  return events;
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDate = (day: number) => {
    setSelectedDate(new Date(year, month, day));
  };

  // Determine current viewed month label
  const currentMonthLabel = `${MONTH_NAMES[month]} ${year}`;
  
  // Selected agenda label
  const selectedDayLabel = `${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}`;
  
  const selectedEvents = useMemo(() => {
    return getMockEventsForDate(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
  }, [selectedDate]);

  return (
    <div className="flex-1 bg-[#F5F6F8] rounded-[32px] p-8 flex flex-col min-h-[350px]">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-xl font-medium text-gray-900">
            <CalendarIcon size={24} /> Calendar
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrevMonth}
            className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 border border-gray-100"
          >
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-full font-medium text-sm shadow-sm border border-gray-100 min-w-[140px] hover:bg-gray-50 transition pointer-events-none">
            {currentMonthLabel}
          </button>
          <button 
            onClick={handleNextMonth}
            className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 border border-gray-100"
          >
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* Calendar Grid Layout */}
        <div className="flex flex-col flex-[2] bg-white rounded-[24px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          {/* Days Header */}
          <div className="grid grid-cols-7 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          
          {/* Dates Grid */}
          <div className="grid grid-cols-7 flex-1 gap-2">
            {/* Empty cells for padding start of month */}
            {Array.from({ length: startDayOfMonth }).map((_, i) => (
              <div key={`empty-start-${i}`} className="p-2"></div>
            ))}
            
            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = 
                selectedDate.getDate() === day && 
                selectedDate.getMonth() === month && 
                selectedDate.getFullYear() === year;
              
              const events = getMockEventsForDate(year, month, day);
              const hasCall = events.some(e => e.type === 'call' || e.type === 'video');
              const hasProject = events.some(e => e.type === 'project');

              return (
                <div 
                  key={day} 
                  onClick={() => handleSelectDate(day)}
                  className={`min-h-[60px] p-2 rounded-[16px] border transition-all flex flex-col relative group cursor-pointer
                    ${isSelected 
                      ? 'border-[#121316] bg-[#121316] text-white shadow-md transform scale-[1.02]' 
                      : 'border-gray-50 bg-gray-50/50 hover:bg-gray-100'}`}
                >
                  <span className={`text-sm pl-1 ${isSelected ? 'text-white font-bold' : 'text-gray-700 font-semibold group-hover:text-black'}`}>
                    {day}
                  </span>
                  
                  <div className="flex gap-1 mt-auto pb-1 pl-1 flex-wrap">
                    {hasCall && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#E0FE8A]' : 'bg-blue-500'}`}></div>}
                    {hasProject && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-pink-400' : 'bg-pink-500'}`}></div>}
                  </div>
                </div>
              )
            })}
            
            {/* Empty padding end of month */}
            {Array.from({ length: (7 - ((startDayOfMonth + daysInMonth) % 7)) % 7 }).map((_, i) => (
              <div key={`empty-end-${i}`} className="p-2"></div>
            ))}
          </div>
        </div>

        {/* Selected Day Agenda */}
        <div className="flex flex-col flex-[1] bg-white rounded-[24px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {selectedDayLabel}
          </h3>
          <p className="text-sm font-medium text-gray-500 mb-6">Daily Schedule</p>

          <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {selectedEvents.length > 0 ? (
              selectedEvents.map((event, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className={`mt-1 w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center text-white
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
              <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60">
                <CalendarIcon size={32} className="text-gray-300 mb-2" />
                <p className="text-sm font-medium text-gray-500">No events scheduled.</p>
                <p className="text-xs text-gray-400 mt-1">Enjoy your free day!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
