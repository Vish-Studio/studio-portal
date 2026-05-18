import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MoreHorizontal } from 'lucide-react';
import MaterialIcon from '../material-icon/material-icon';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ColumnAlign = 'left' | 'center' | 'right';
export type HideBelow = 'sm' | 'md' | 'lg';

export interface Column<T = any> {
  key: string;
  label: string;
  /** Custom cell renderer — receives the full row object. */
  render?: (row: T) => React.ReactNode;
  align?: ColumnAlign;
  thClassName?: string;
  tdClassName?: string;
  hideBelow?: HideBelow;
  /** Fixed or max column width, e.g. "w-10" or "w-40 max-w-40" */
  width?: string;
  /** Set to false to disable sorting for this column. All labelled columns are sortable by default. */
  sortable?: boolean;
}

export interface TableDataProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  loadingRows?: number;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
  /** Default sort key and direction on first render. */
  defaultSort?: { key: string; dir: 'asc' | 'desc' };
}

// ─── Row Action types ─────────────────────────────────────────────────────────

export interface RowAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

// ─── RowActionsMenu — 3-dot dropdown (kept for backward compat) ───────────────

export const RowActionsMenu = ({ actions }: { actions: RowAction[] }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={ref} className="row-actions-menu relative inline-flex">
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        className={`row-actions-menu-trigger w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 transition-colors
          ${open ? 'bg-gray-100 text-gray-700' : 'hover:bg-gray-100 hover:text-gray-700'}`}
        aria-label="Row actions"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div
          className="row-actions-menu-dropdown absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-40"
          onClick={e => e.stopPropagation()}
        >
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={() => { action.onClick(); setOpen(false); }}
              className={`row-actions-menu-item w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium transition-colors text-left
                ${action.variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {action.icon && <span className="shrink-0 opacity-70">{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── RowActions — responsive: inline on desktop, 3-dot menu on mobile ─────────
//
// Use this in table action columns. On md+ each action renders as a labelled
// icon button; below md the compact dropdown is used instead.

export const RowActions = ({ actions }: { actions: RowAction[] }) => (
  <div
    className="row-actions flex items-center justify-end"
    onClick={e => e.stopPropagation()}
  >
    {/* Mobile / tablet — compact dropdown */}
    <div className="row-actions-mobile md:hidden">
      <RowActionsMenu actions={actions} />
    </div>

    {/* Desktop — inline icon buttons shown in a row */}
    <div className="row-actions-desktop hidden md:flex items-center gap-0.5">
      {actions.map((action, i) => (
        <button
          key={i}
          type="button"
          onClick={action.onClick}
          title={action.label}
          aria-label={action.label}
          className={`row-actions-button w-8 h-8 flex items-center justify-center rounded-lg transition-colors shrink-0 ${
            action.variant === 'danger'
              ? 'text-gray-300 hover:text-red-600 hover:bg-red-50'
              : 'text-gray-300 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          {action.icon}
        </button>
      ))}
    </div>
  </div>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const HIDE_CLASS: Record<HideBelow, string> = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
};

const ALIGN_CLASS: Record<ColumnAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

// ─── TableData ────────────────────────────────────────────────────────────────

const TableData = <T extends { id: string }>({
  columns,
  data,
  loading = false,
  loadingRows = 6,
  emptyMessage = 'No records found.',
  onRowClick,
  className = '',
  defaultSort,
}: TableDataProps<T>) => {
  const [sortKey, setSortKey] = useState<string | null>(defaultSort?.key ?? null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(defaultSort?.dir ?? 'asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = (a as any)[sortKey];
      const bVal = (b as any)[sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      let cmp = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        cmp = aVal - bVal;
      } else if (typeof aVal === 'object' && 'toMillis' in aVal) {
        cmp = aVal.toMillis() - bVal.toMillis();
      } else {
        cmp = String(aVal).localeCompare(String(bVal), undefined, { sensitivity: 'base' });
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const isSortable = (col: Column<T>) => col.label !== '' && col.sortable !== false;

  return (
    <div className={`table-data w-full max-w-full bg-white border border-gray-200 rounded-[18px] overflow-hidden flex flex-col h-full ${className}`}>

      <div className="table-data-scroll overflow-auto flex-1 min-h-0">
        <table className="table-data-table min-w-[720px] border-separate border-spacing-0 sm:min-w-full">

          <thead className="table-data-head sticky top-0 z-10">
            <tr className="bg-gray-50">
              {columns.map(col => {
                const sortable = isSortable(col);
                const isActive = sortKey === col.key;

                return (
                  <th
                    key={col.key}
                    scope="col"
                    onClick={sortable ? () => handleSort(col.key) : undefined}
                    className={[
                      'px-4 py-3 text-[12px] font-semibold text-gray-500 tracking-wider whitespace-nowrap select-none border-b border-gray-100',
                      ALIGN_CLASS[col.align ?? 'left'],
                      col.hideBelow ? HIDE_CLASS[col.hideBelow] : '',
                      col.width ?? '',
                      col.thClassName ?? '',
                      sortable ? 'cursor-pointer group hover:text-gray-800 hover:bg-gray-100/80 transition-colors' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortable && col.label && (
                        <span className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                          {isActive ? (
                            sortDir === 'asc'
                              ? <MaterialIcon name="arrow_upward" size={12} />
                              : <MaterialIcon name="arrow_downward" size={12} />
                          ) : (
                            <MaterialIcon name="unfold_more" size={12} />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="table-data-body">
            {loading ? (
              Array.from({ length: loadingRows }).map((_, i) => (
                <tr key={`sk-${i}`} className="border-b border-gray-100 last:border-0">
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className={[
                        'px-4 py-3 border-b border-gray-100',
                        col.hideBelow ? HIDE_CLASS[col.hideBelow] : '',
                        col.width ?? '',
                      ].filter(Boolean).join(' ')}
                    >
                      <div
                        className="table-data-skeleton h-3.5 rounded-full bg-gray-100 animate-pulse"
                        style={{ width: `${55 + ((i * 13 + col.key.length * 7) % 35)}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-gray-400 font-normal"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map(row => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={[
                    'transition-colors duration-100 group',
                    'border-b border-gray-100 last:border-0',
                    onRowClick ? 'cursor-pointer hover:bg-gray-50' : 'hover:bg-gray-50/60',
                  ].join(' ')}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className={[
                        'px-4 py-3 text-sm font-normal text-gray-900 align-middle',
                        ALIGN_CLASS[col.align ?? 'left'],
                        col.hideBelow ? HIDE_CLASS[col.hideBelow] : '',
                        col.width ?? '',
                        col.tdClassName ?? '',
                      ].filter(Boolean).join(' ')}
                    >
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && sortedData.length > 0 && (
        <div className="table-data-footer px-4 py-2.5 border-t border-gray-100 bg-gray-50/40 shrink-0">
          <span className="text-xs text-gray-400 font-medium">
            {sortedData.length} record{sortedData.length !== 1 ? 's' : ''}
            {sortKey && (
              <span className="ml-2 text-gray-300">
                · sorted by <span className="text-gray-400">{columns.find(c => c.key === sortKey)?.label}</span> {sortDir === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default TableData;
