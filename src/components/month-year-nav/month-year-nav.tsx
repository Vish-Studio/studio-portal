import React from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

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
  const prevYear  = () => onChange(new Date(year - 1, month, 1));
  const nextYear  = () => onChange(new Date(year + 1, month, 1));

  const navBtn = "w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-100 border border-gray-100 transition-colors shrink-0";
  const yearBtn = "flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors leading-none p-0.5";

  return (
    <div className="flex items-center gap-3">
      {/* Prev month */}
      <button onClick={prevMonth} className={navBtn} aria-label="Previous month">
        <ChevronLeft size={16} className="text-gray-600" />
      </button>

      {/* Month + Year display */}
      <div className="flex items-center gap-3 select-none">
        <span className="font-semibold text-sm text-gray-800 w-20 text-center">
          {MONTH_NAMES[month]}
        </span>

        {/* Year with up/down controls */}
        <div className="flex flex-col items-center gap-0">
          <button onClick={nextYear} className={yearBtn} aria-label="Next year">
            <ChevronUp size={13} />
          </button>
          <span className="font-semibold text-sm text-gray-800 tabular-nums leading-tight">
            {year}
          </span>
          <button onClick={prevYear} className={yearBtn} aria-label="Previous year">
            <ChevronDown size={13} />
          </button>
        </div>
      </div>

      {/* Next month */}
      <button onClick={nextMonth} className={navBtn} aria-label="Next month">
        <ChevronRight size={16} className="text-gray-600" />
      </button>
    </div>
  );
}
