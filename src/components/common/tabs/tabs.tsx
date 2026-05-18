import type { ReactNode } from 'react';
import Select from '../select/select';
import Option from '../select/option';
import { cn } from '@/src/lib/utils';

export interface TabItem {
  key: string;
  label: ReactNode;
  count?: number;
  icon?: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  value?: string;
  onChange?: (key: string) => void;
  className?: string;
  listClassName?: string;
  mobileMode?: 'select' | 'scroll';
  equalWidth?: boolean;
  ariaLabel?: string;
}

export default function Tabs({
  items,
  value,
  onChange,
  className = '',
  listClassName = '',
  mobileMode = 'select',
  equalWidth = false,
  ariaLabel = 'Tabs',
}: TabsProps) {
  if (!items.length) return null;

  return (
    <div className={cn('tabs min-w-0', className)}>
      {mobileMode === 'select' && (
        <Select
          value={value}
          onChange={event => onChange?.(event.target.value)}
          wrapperClassName="tabs-mobile-select min-w-0 flex-1 lg:hidden"
          className="py-2.5"
          aria-label={ariaLabel}
        >
          {items.map(item => (
            <Option key={item.key} value={item.key}>
              {item.count !== undefined ? `${item.label} (${item.count})` : item.label}
            </Option>
          ))}
        </Select>
      )}

      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          'tabs-list min-w-0 items-center gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1.5 no-scrollbar',
          mobileMode === 'select' ? 'hidden lg:flex' : 'flex',
          listClassName,
        )}
      >
        {items.map(item => {
          const isActive = item.key === value;

          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange?.(item.key)}
              className={cn(
                'tabs-trigger type-tab flex shrink-0 items-center justify-center gap-2 rounded-lg px-3.5 py-2 transition-colors',
                equalWidth && 'min-w-0 flex-1',
                isActive
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800',
              )}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span
                  className={cn(
                    'tabs-count type-count hidden rounded-md px-1.5 py-0.5 lg:block',
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500',
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
