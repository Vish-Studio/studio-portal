import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface MonthYearNavProps {
  value: Date;
  onChange: (date: Date) => void;
}

export default function MonthYearNav({ value, onChange }: MonthYearNavProps) {
  const month = value.getMonth();
  const year = value.getFullYear();

  const prevMonth = () => onChange(new Date(year, month - 1, 1));
  const nextMonth = () => onChange(new Date(year, month + 1, 1));
  const goToToday = () => onChange(new Date());

  const btnClass = "w-9 h-9 flex items-center justify-center bg-white border border-gray-100 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors shrink-0";

  return (
    <div className="flex items-center gap-2">
      <button onClick={prevMonth} className={btnClass} aria-label="Previous month">
        <ChevronLeft size={15} strokeWidth={2.5} />
      </button>

      <span className="font-medium text-sm text-gray-800 min-w-29.5 text-center select-none">
        {MONTH_NAMES[month]} {year}
      </span>

      <button onClick={nextMonth} className={btnClass} aria-label="Next month">
        <ChevronRight size={15} strokeWidth={2.5} />
      </button>
    </div>
  );
}
