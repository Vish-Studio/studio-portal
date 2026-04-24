import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';

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
}

export interface TableDataProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  loadingRows?: number;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

// ─── Row Actions Menu ─────────────────────────────────────────────────────────

export interface RowAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export function RowActionsMenu({ actions }: { actions: RowAction[] }) {
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
    <div ref={ref} className="relative inline-flex">
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 transition-colors
          ${open ? 'bg-gray-100 text-gray-700' : 'hover:bg-gray-100 hover:text-gray-700'}`}
        aria-label="Row actions"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-40"
          onClick={e => e.stopPropagation()}
        >
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={() => { action.onClick(); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium transition-colors text-left
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
}

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

/**
 * Single-table design: thead + tbody share the same <table> element so column
 * widths are always computed together — no header/cell misalignment.
 * The thead is position:sticky so it stays visible while the body scrolls.
 */
export default function TableData<T extends { id: string }>({
  columns,
  data,
  loading = false,
  loadingRows = 6,
  emptyMessage = 'No records found.',
  onRowClick,
  className = '',
}: TableDataProps<T>) {
  return (
    <div className={`table-data w-full bg-white border border-gray-200 rounded-[18px] overflow-hidden flex flex-col h-full ${className}`}>

      {/* Single scroll container — thead and tbody share the same table */}
      <div className="overflow-auto flex-1 min-h-0">
        <table className="min-w-full border-separate border-spacing-0">

          {/* Sticky header — solid bg so rows don't bleed through */}
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-50">
              {columns.map(col => (
                <th
                  key={col.key}
                  scope="col"
                  className={[
                    'px-4 py-3 text-[12px] font-semibold text-gray-500 tracking-wider whitespace-nowrap select-none border-b border-gray-100',
                    ALIGN_CLASS[col.align ?? 'left'],
                    col.hideBelow ? HIDE_CLASS[col.hideBelow] : '',
                    col.width ?? '',
                    col.thClassName ?? '',
                  ].filter(Boolean).join(' ')}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
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
                        className="h-3.5 rounded-full bg-gray-100 animate-pulse"
                        style={{ width: `${55 + ((i * 13 + col.key.length * 7) % 35)}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-gray-400 font-normal"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map(row => (
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

      {/* Footer count */}
      {!loading && data.length > 0 && (
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/40 shrink-0">
          <span className="text-xs text-gray-400 font-medium">
            {data.length} record{data.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
