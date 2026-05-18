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
   * On ≥lg screens the button shows label + icon.
   * On mobile/tablet the button is hidden — use the Fab component instead.
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
  const hasTabs = Boolean(tabs?.length);
  const hasControls = showViewToggle || showSort || controls;
  const sortDirectionLabel = currentDirection === 'asc' ? 'Ascending' : 'Descending';

  useEffect(() => {
    if (!isSortOpen) return;
    const close = (event: MouseEvent) => {
      if (!sortRef.current?.contains(event.target as Node)) setIsSortOpen(false);
    };

    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [isSortOpen]);

  return (
    <div className={`table-tab flex w-full flex-wrap items-center gap-3 ${className}`}>

      <div className="table-tab-toolbar flex min-w-0 flex-1 flex-wrap items-center gap-3">
        {hasTabs && (
          <Tabs
            items={tabs}
            value={activeTab}
            onChange={onTabChange}
            className="min-w-0 flex-1 basis-52"
            listClassName="w-full"
            equalWidth
            ariaLabel="Table filters"
          />
        )}

        {hasControls && (
          <div className="table-tab-controls ml-auto flex h-11 shrink-0 items-center gap-2">
            {showViewToggle && (
              <div className="table-tab-view-toggle hidden h-11 items-center gap-1 rounded-[16px] border border-gray-200 bg-white p-1 lg:flex">
                <button
                  type="button"
                  onClick={() => onViewModeChange('grid')}
                  className={`table-tab-view-button flex h-9 w-9 items-center justify-center rounded-[12px] transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-black text-white'
                      : 'text-gray-400 hover:bg-(--color-surface-alt) hover:text-gray-700'
                  }`}
                  aria-label="Grid view"
                >
                  <MaterialIcon name="grid_view" size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange('list')}
                  className={`table-tab-view-button flex h-9 w-9 items-center justify-center rounded-[12px] transition-colors ${
                    viewMode === 'list'
                      ? 'bg-black text-white'
                      : 'text-gray-400 hover:bg-(--color-surface-alt) hover:text-gray-700'
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
                  className="table-tab-sort-trigger type-control flex h-11 items-center gap-2 rounded-[16px] border border-gray-200 bg-white px-3 text-gray-600 transition-colors hover:bg-(--color-surface-alt) hover:text-gray-900"
                  aria-label={`Sort by ${selectedSort?.label ?? 'selected option'}, ${sortDirectionLabel}`}
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                >
                  <MaterialIcon name={currentDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'} size={16} />
                  <span className="hidden lg:inline">{selectedSort?.label ?? 'Sort'}</span>
                  <MaterialIcon name="expand_more" size={16} className={`text-gray-400 ${isSortOpen ? 'rotate-180 transition-transform' : 'transition-transform'}`} />
                </button>

                {isSortOpen && (
                  <div
                    role="listbox"
                    className="table-tab-sort-menu absolute right-0 top-[calc(100%+8px)] z-50 w-[min(18rem,calc(100vw-2rem))] rounded-[18px] border border-gray-200 bg-white p-2"
                  >
                    <div className="table-tab-sort-header flex items-center justify-between gap-3 px-2 pb-2">
                      <div className="min-w-0">
                        <p className="type-label text-gray-900">Sort list</p>
                        <p className="type-meta text-gray-400">{selectedSort?.label ?? 'Sort'} · {sortDirectionLabel}</p>
                      </div>

                      {onSortDirectionChange && (
                        <button
                          type="button"
                          onClick={() => onSortDirectionChange(currentDirection === 'asc' ? 'desc' : 'asc')}
                          className="table-tab-sort-direction-button flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-(--color-surface-alt) text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                          aria-label={`Switch to ${currentDirection === 'asc' ? 'descending' : 'ascending'} sort`}
                        >
                          <MaterialIcon name={currentDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'} size={16} />
                        </button>
                      )}
                    </div>

                    <div className="table-tab-sort-options space-y-1">
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
                                ? 'bg-(--color-surface-alt) text-gray-900'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <span className="flex-1 truncate">{option.label}</span>
                            {isSelected && <MaterialIcon name="check" size={16} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {controls && <div className="table-tab-custom-controls flex items-center gap-1">{controls}</div>}
          </div>
        )}
      </div>

      {/* Right — action button (hidden on mobile/tablet; use Fab instead) */}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="table-tab-action type-control hidden h-11 shrink-0 items-center gap-2 rounded-[16px] bg-black px-4 text-white transition-colors hover:bg-gray-800 lg:flex"
        >
          <MaterialIcon name="add" size={19} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default TableTab;
