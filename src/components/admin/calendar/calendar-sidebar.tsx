import { FormEvent, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';

interface CalendarSidebarProps {
  visibleMonth: Date;
  selectedDate: Date;
  today: Date;
  days: Array<Date | null>;
  monthNames: string[];
  weekDays: string[];
  onMoveMonth: (offset: number) => void;
  onSelectDate: (date: Date) => void;
  isSameDate: (a: Date, b: Date) => boolean;
}

interface CalendarCategory {
  id: string;
  label: string;
  dotClass: string;
}

const categoryColors = ['bg-violet-300', 'bg-cyan-200', 'bg-lime-300', 'bg-rose-300', 'bg-gray-300'];

const initialCategories: CalendarCategory[] = [
  { id: 'work', label: 'Work', dotClass: 'bg-violet-300' },
  { id: 'personal', label: 'Personal', dotClass: 'bg-cyan-200' },
  { id: 'education', label: 'Education', dotClass: 'bg-gray-300' },
];

export default function CalendarSidebar({
  visibleMonth,
  selectedDate,
  today,
  days,
  monthNames,
  weekDays,
  onMoveMonth,
  onSelectDate,
  isSameDate,
}: CalendarSidebarProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [categoryName, setCategoryName] = useState('');

  const addCategory = (event: FormEvent) => {
    event.preventDefault();
    const label = categoryName.trim();
    if (!label) return;

    setCategories(currentCategories => [
      ...currentCategories,
      {
        id: `${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        label,
        dotClass: categoryColors[currentCategories.length % categoryColors.length],
      },
    ]);
    setCategoryName('');
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(currentCategories => currentCategories.filter(category => category.id !== categoryId));
  };

  return (
    <aside className="grid gap-4 xl:content-start">
      <div className="rounded-[18px] bg-(--color-ink) p-4 text-white md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">
            {monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
          </h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onMoveMonth(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => onMoveMonth(1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {weekDays.map(day => (
            <span key={day} className="text-center text-[10px] font-bold uppercase text-gray-400">
              {day.slice(0, 2)}
            </span>
          ))}
          {days.map((date, index) => {
            if (!date) return <span key={`mini-empty-${index}`} className="h-9" />;
            const selected = isSameDate(date, selectedDate);
            const currentDay = isSameDate(date, today);

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => onSelectDate(date)}
                className={`flex h-9 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                  selected
                    ? 'bg-(--color-accent-lime) text-(--color-ink)'
                    : currentDay
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[18px] bg-(--color-ink) p-4 text-white md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold">Categories</h3>
          <span className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-bold text-gray-300">
            {categories.length}
          </span>
        </div>

        <form onSubmit={addCategory} className="mb-4 flex gap-2">
          <input
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="New category"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium text-white outline-none placeholder:text-gray-500 focus:border-white/30"
          />
          <button
            type="submit"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-(--color-ink) transition-colors hover:bg-(--color-accent-lime)"
            aria-label="Add category"
          >
            <Plus size={16} />
          </button>
        </form>

        <div className="flex flex-col gap-2">
          {categories.map(category => (
            <div
              key={category.id}
              className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10"
            >
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${category.dotClass}`} />
              <span className="min-w-0 flex-1 truncate">{category.label}</span>
              <button
                type="button"
                onClick={() => deleteCategory(category.id)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-300"
                aria-label={`Delete ${category.label}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
