import React from 'react';
import { Plus } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

export interface TableToolbarProps {
  /** Tab items rendered in the left pill container. Omit to hide tabs. */
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  /**
   * Primary action label and handler.
   * On ≥sm screens the button shows label + icon.
   * On mobile the button is hidden — use the Fab component instead.
   */
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

// ─── TableToolbar ─────────────────────────────────────────────────────────────

export default function TableToolbar({
  tabs,
  activeTab,
  onTabChange,
  actionLabel,
  onAction,
  className = '',
}: TableToolbarProps) {
  return (
    <div className={`flex items-center justify-between gap-3 flex-wrap shrink-0 ${className}`}>

      {/* Left — filter tabs */}
      {tabs && tabs.length > 0 && (
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-2xl">
          {tabs.map(tab => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange?.(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'
                  }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md leading-none
                      ${isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Right — action button (hidden on mobile; use Fab instead) */}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="hidden sm:flex items-center gap-2 bg-black text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors shrink-0 ml-auto"
        >
          <Plus size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
