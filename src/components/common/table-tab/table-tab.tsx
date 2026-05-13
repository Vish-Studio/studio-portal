import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import MaterialIcon from '../material-icon/material-icon';
import Tabs from '../tabs/tabs';
import type { TabItem } from '../tabs/tabs';
export type { TabItem } from '../tabs/tabs';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SortOption {
  key: string;
  label: string;
}

export interface TableTabProps {
  /** Tab items rendered in the left pill container. Omit to hide tabs. */
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  /** Optional grid/list view toggle rendered beside the tabs. */
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  /** Optional sort dropdown rendered beside the tabs. */
  sortOptions?: SortOption[];
  sortValue?: string;
  onSortChange?: (key: string) => void;
  sortDirection?: 'asc' | 'desc';
  onSortDirectionChange?: (direction: 'asc' | 'desc') => void;
  /** Optional custom controls rendered after built-in view/sort controls. */
  controls?: React.ReactNode;
  /**
   * Primary action label and handler.
   * On ≥sm screens the button shows label + icon.
   * On mobile the button is hidden — use the Fab component instead.
   */
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

// ─── TableTab ─────────────────────────────────────────────────────────────

const TableTab: FunctionComponent<TableTabProps> = ({
  className = '',
  tabs,
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  sortOptions,
  sortValue,
  onSortChange,
  sortDirection,
  onSortDirectionChange,
  controls,
  actionLabel,
  onAction,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const showViewToggle = viewMode && onViewModeChange;
  const showSort = Boolean(sortOptions?.length && sortValue && onSortChange);
  const selectedSort = sortOptions?.find(option => option.key === sortValue) ?? sortOptions?.[0];
  const currentDirection = sortDirection ?? 'desc';
  const hasControls = showViewToggle || showSort || controls;

  useEffect(() => {
    if (!isSortOpen) return;
    const close = (event: MouseEvent) => {
      if (!sortRef.current?.contains(event.target as Node)) setIsSortOpen(false);
    };

    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [isSortOpen]);

  return (
    <div className={`table-tab flex items-center justify-between gap-3 flex-wrap w-full ${className}`}>

      {tabs && tabs.length > 0 && (
        <Tabs
          items={tabs}
          value={activeTab}
          onChange={onTabChange}
          className="min-w-0 flex-1 md:flex-none"
          ariaLabel="Table filters"
        />
      )}

      {hasControls && (
        <div className="table-tab-controls flex shrink-0 items-center gap-2 md:mr-auto">
          {showViewToggle && (
            <div className="table-tab-view-toggle hidden items-center gap-0.5 rounded-xl bg-gray-100 p-1 sm:flex">
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                className={`table-tab-view-button flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-400 hover:bg-white/70 hover:text-gray-700'
                }`}
                aria-label="Grid view"
              >
                <MaterialIcon name="grid_view" size={17} />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('list')}
                className={`table-tab-view-button flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-400 hover:bg-white/70 hover:text-gray-700'
                }`}
                aria-label="List view"
              >
                <MaterialIcon name="view_list" size={18} />
              </button>
            </div>
          )}

          {showSort && (
            <div ref={sortRef} className="table-tab-sort relative">
              <button
                type="button"
                onClick={() => setIsSortOpen(open => !open)}
                className="table-tab-sort-trigger type-control flex h-10 items-center gap-2 rounded-xl bg-gray-100 px-3 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
                aria-label="Sort"
                aria-haspopup="listbox"
                aria-expanded={isSortOpen}
              >
                <MaterialIcon name="sort" size={17} />
                <span className="hidden sm:inline">{selectedSort?.label ?? 'Sort'}</span>
                <MaterialIcon name="expand_more" size={16} className={isSortOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>

              {isSortOpen && (
                <div
                  role="listbox"
                  className="table-tab-sort-menu absolute right-0 top-[calc(100%+6px)] z-50 min-w-52 rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_18px_50px_rgba(15,23,42,0.16)]"
                >
                  {onSortDirectionChange && (
                    <div className="table-tab-sort-direction mb-2 grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
                      {(['asc', 'desc'] as const).map(direction => (
                        <button
                          key={direction}
                          type="button"
                          onClick={() => onSortDirectionChange(direction)}
                          className={`table-tab-sort-direction-button type-meta rounded-lg px-3 py-1.5 transition-colors ${
                            currentDirection === direction
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-400 hover:text-gray-700'
                          }`}
                        >
                          {direction === 'asc' ? 'Ascending' : 'Descending'}
                        </button>
                      ))}
                    </div>
                  )}

                  {sortOptions?.map(option => {
                    const isSelected = option.key === sortValue;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onSortChange?.(option.key);
                          setIsSortOpen(false);
                        }}
                        className={`table-tab-sort-option type-label flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          isSelected
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="flex-1 truncate">{option.label}</span>
                        {isSelected && <MaterialIcon name="check" size={16} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {controls}
        </div>
      )}

      {/* Right — action button (hidden on mobile; use Fab instead) */}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="table-tab-action type-control ml-auto hidden shrink-0 items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-white transition-colors hover:bg-gray-800 sm:flex"
        >
          <MaterialIcon name='add' size={20} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default TableTab;
