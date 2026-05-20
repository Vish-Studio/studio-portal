import type { KeyboardEvent, ReactNode } from 'react';
import { RowActionsMenu, type RowAction } from '../table/table';

interface ListItemRowProps<T = unknown> {
  item?: T;
  title: ReactNode;
  subtitle?: ReactNode;
  secondary?: ReactNode;
  tertiary?: ReactNode;
  status?: ReactNode;
  actions?: RowAction[];
  icon?: ReactNode;
  onOpen?: (item: T) => void;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  gridClassName?: string;
}

export default function ListItemRow<T = unknown>({
  item,
  title,
  subtitle,
  secondary,
  tertiary,
  status,
  actions,
  icon,
  onOpen,
  className = '',
  titleClassName = '',
  subtitleClassName = '',
  gridClassName = 'lg:grid-cols-[minmax(240px,1fr)_minmax(180px,0.8fr)_130px_120px_32px]',
}: ListItemRowProps<T>) {
  const interactive = Boolean(onOpen);
  const hasStatus = Boolean(status);

  const handleOpen = () => {
    if (onOpen) onOpen(item as T);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpen();
    }
  };

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? handleOpen : undefined}
      onKeyDown={handleKeyDown}
      className={`list-item-row grid gap-3 rounded-[18px] border border-gray-200 bg-white px-4 py-3.5 text-left transition-colors hover:border-gray-300 hover:bg-gray-50 ${interactive ? 'cursor-pointer' : ''} ${gridClassName} lg:items-center ${className}`}
    >
      <div className="list-item-row-primary flex min-w-0 items-center gap-3">
        {icon && <div className="list-item-row-icon shrink-0">{icon}</div>}
        <div className="list-item-row-copy min-w-0">
          <div className="list-item-row-title-wrap flex min-w-0 flex-wrap items-center gap-2">
            <p className={`list-item-row-title type-card-title truncate text-(--color-ink) ${titleClassName}`}>{title}</p>
            {hasStatus && <div className="list-item-row-mobile-status lg:hidden">{status}</div>}
          </div>
          {subtitle && <div className={`list-item-row-subtitle mt-1 ${subtitleClassName}`}>{subtitle}</div>}
        </div>
      </div>

      <div className="list-item-row-secondary min-w-0 rounded-2xl bg-gray-50/70 px-3 py-2 lg:bg-transparent lg:px-0 lg:py-0">{secondary}</div>
      <div className="list-item-row-tertiary min-w-0 rounded-2xl bg-gray-50/70 px-3 py-2 lg:bg-transparent lg:px-0 lg:py-0">{tertiary}</div>
      {hasStatus && <div className="list-item-row-status hidden justify-end lg:flex">{status}</div>}

      <div className="list-item-row-actions flex justify-end" onClick={event => event.stopPropagation()}>
        {actions && actions.length > 0 && <RowActionsMenu actions={actions} />}
      </div>
    </div>
  );
}

export type { ListItemRowProps };
