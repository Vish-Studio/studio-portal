import type { KeyboardEvent, ReactNode } from 'react';
import { RowActionsMenu, type RowAction } from '../table/table';

interface CardListItemProps<T = unknown> {
  title: ReactNode;
  subtitle?: ReactNode;
  subTitle?: ReactNode;
  icon?: ReactNode;
  actions?: RowAction[];
  children?: ReactNode;
  footer?: ReactNode;
  item?: T;
  onOpen?: (item: T) => void;
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  actionsClassName?: string;
}

export default function CardListItem<T = unknown>({
  title,
  subtitle,
  subTitle,
  icon,
  actions,
  children,
  footer,
  item,
  onOpen,
  className = '',
  headerClassName = '',
  titleClassName = '',
  subtitleClassName = '',
  contentClassName = '',
  footerClassName = '',
  actionsClassName = '',
}: CardListItemProps<T>) {
  const interactive = Boolean(onOpen);
  const resolvedSubtitle = subTitle ?? subtitle;

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
      className={`card-list-item rounded-[18px] border border-gray-200 bg-white text-left transition-colors hover:bg-gray-50 ${interactive ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className={`card-list-item-header flex min-w-0 items-start justify-between gap-3 p-4 pb-3 ${headerClassName}`}>
        <div className="card-list-item-heading flex min-w-0 items-start gap-3">
          {icon && <div className="card-list-item-icon shrink-0">{icon}</div>}
          <div className="card-list-item-copy min-w-0">
            <p className={`card-list-item-title type-card-title truncate text-(--color-ink) ${titleClassName}`}>{title}</p>
            {resolvedSubtitle && (
              <div className={`card-list-item-subtitle mt-1 ${subtitleClassName}`}>
                {resolvedSubtitle}
              </div>
            )}
          </div>
        </div>

        {actions && actions.length > 0 && (
          <div
            className={`card-list-item-actions shrink-0 ${actionsClassName}`}
            onClick={event => event.stopPropagation()}
          >
            <RowActionsMenu actions={actions} />
          </div>
        )}
      </div>

      {children && <div className={`card-list-item-content px-4 pb-3 ${contentClassName}`}>{children}</div>}
      {footer && <div className={`card-list-item-footer mt-auto flex items-center justify-between gap-2 border-t border-gray-50 px-4 py-2.5 ${footerClassName}`}>{footer}</div>}
    </div>
  );
}

export type { CardListItemProps };
