import { MONTH_NAMES } from '@/src/data/calendar';
import ButtonIcon from '../../common/button-icon/button-icon';
import Button from '../../common/button/button';

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
  const years = Array.from({ length: 21 }, (_, i) => year - 10 + i);

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button type="button" variant="ghost" size="sm" onClick={goToToday} className="hidden sm:inline-flex">
        Today
      </Button>

      <ButtonIcon iconName="chevron_left" clickHandler={prevMonth} aria-label="Previous month" />

      <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
        <select
          value={month}
          onChange={(e) => onChange(new Date(year, Number(e.target.value), 1))}
          className="h-8 rounded-lg border-0 bg-white px-2 text-xs font-bold text-gray-700 outline-none"
          aria-label="Jump to month"
        >
          {MONTH_NAMES.map((name, index) => (
            <option key={name} value={index}>{name}</option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => onChange(new Date(Number(e.target.value), month, 1))}
          className="h-8 rounded-lg border-0 bg-white px-2 text-xs font-bold text-gray-700 outline-none"
          aria-label="Jump to year"
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <ButtonIcon iconName="chevron_right" clickHandler={nextMonth} aria-label="Next month" />
    </div>
  );
}
