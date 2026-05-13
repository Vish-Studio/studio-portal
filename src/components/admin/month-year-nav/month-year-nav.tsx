import { MONTH_NAMES } from '@/src/data/calendar';
import ButtonIcon from '../../common/button-icon/button-icon';
import Button from '../../common/button/button';
import Select from '../../common/select/select';
import Option from '../../common/select/option';

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
    <div className="month-year-nav flex flex-wrap items-center justify-end gap-2">
      <Button type="button" variant="ghost" size="sm" onClick={goToToday} className="hidden sm:inline-flex">
        Today
      </Button>

      <ButtonIcon iconName="chevron_left" clickHandler={prevMonth} aria-label="Previous month" />

      <div className="month-year-nav-picker flex items-center gap-1 rounded-xl bg-gray-100 p-1">
        <Select
          value={month}
          onChange={(e) => onChange(new Date(year, Number(e.target.value), 1))}
          wrapperClassName="w-32"
          className="h-8 rounded-lg border-0 bg-white px-2 py-0 text-xs font-bold text-gray-700 shadow-none focus:ring-0"
          aria-label="Jump to month"
        >
          {MONTH_NAMES.map((name, index) => (
            <Option key={name} value={index}>{name}</Option>
          ))}
        </Select>
        <Select
          value={year}
          onChange={(e) => onChange(new Date(Number(e.target.value), month, 1))}
          wrapperClassName="w-24"
          className="h-8 rounded-lg border-0 bg-white px-2 py-0 text-xs font-bold text-gray-700 shadow-none focus:ring-0"
          aria-label="Jump to year"
        >
          {years.map(y => (
            <Option key={y} value={y}>{y}</Option>
          ))}
        </Select>
      </div>

      <ButtonIcon iconName="chevron_right" clickHandler={nextMonth} aria-label="Next month" />
    </div>
  );
}
