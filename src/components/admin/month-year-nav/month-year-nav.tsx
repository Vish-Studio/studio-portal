import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTH_NAMES } from '@/src/data/calendar';
import MaterialIcon from '../../common/material-icon/material-icon';
import ButtonIcon from '../../common/button-icon/button-icon';

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

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium text-sm text-gray-800 md:hidden text-center select-none">
        {MONTH_NAMES[month]} {year}
      </span>

      <ButtonIcon iconName="chevron_left" clickHandler={prevMonth} aria-label="Previous month" />

      <span className="font-medium text-sm text-gray-800 hidden md:block md:min-w-29.5 text-center select-none">
        {MONTH_NAMES[month]} {year}
      </span>

      <ButtonIcon iconName="chevron_right" clickHandler={nextMonth} aria-label="Next month" />
    </div>
  );
}
