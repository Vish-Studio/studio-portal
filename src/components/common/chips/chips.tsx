import type { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';

export interface ChipItem<Value extends string> {
  value: Value;
  label: ReactNode;
  icon?: ReactNode;
}

interface ChipsProps<Value extends string> {
  items: ChipItem<Value>[];
  value: Value;
  onChange: (value: Value) => void;
  className?: string;
}

export default function Chips<Value extends string>({
  items,
  value,
  onChange,
  className = '',
}: ChipsProps<Value>) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="tablist">
      {items.map(item => {
        const active = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              'inline-flex min-h-10 items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors',
              active
                ? 'border-(--color-ink) bg-(--color-ink) text-white'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900',
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
