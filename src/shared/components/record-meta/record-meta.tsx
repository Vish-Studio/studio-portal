import { format } from 'date-fns';
import MaterialIcon from '../material-icon/material-icon';

export interface RecordMetaItem {
  label: React.ReactNode;
  icon?: string;
  title?: string;
}

export interface RecordMetaProps {
  items: Array<RecordMetaItem | false | null | undefined>;
  className?: string;
}

export function formatRecordDate(value?: Date | number | string | null, fallback = '—') {
  if (!value) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return format(date, 'MMM d, yyyy');
}

export default function RecordMeta({ items, className = '' }: RecordMetaProps) {
  const visibleItems = items.filter(Boolean) as RecordMetaItem[];
  if (visibleItems.length === 0) return null;

  return (
    <div className={`record-meta type-meta flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-gray-400 ${className}`}>
      {visibleItems.map((item, index) => (
        <span key={index} className="record-meta-item inline-flex min-w-0 items-center gap-1">
          {index > 0 && <span className="record-meta-separator text-gray-200">·</span>}
          {item.icon && <MaterialIcon name={item.icon} size={10} className="shrink-0 text-gray-300" />}
          <span className="record-meta-label min-w-0 truncate" title={item.title}>
            {item.label}
          </span>
        </span>
      ))}
    </div>
  );
}
