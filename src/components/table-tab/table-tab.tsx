import React, { FunctionComponent } from 'react';
import { Plus } from 'lucide-react';
import MaterialIcon from '../ui/material-icon';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

export interface TableTabProps {
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

// ─── TableTab ─────────────────────────────────────────────────────────────

const TableTab: FunctionComponent<TableTabProps> = ({
  className = '',
  tabs,
  activeTab,
  onTabChange,
  actionLabel,
  onAction,
}) => {
  return (
    <div className={`table-tab flex items-center justify-between gap-3 flex-wrap w-full md:w-auto ${className}`}>

      {/* Left — filter tabs */}
      {tabs && tabs.length > 0 && (
        <div className="flex items-center gap-1 p-1.5 bg-gray-100 rounded-xl w-full md:w-auto">
          {tabs.map(tab => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange?.(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-medium transition-colors
                  ${isActive
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'
                  }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`hidden md:block text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none
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
          className="hidden sm:flex items-center gap-2 bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors shrink-0 ml-auto"
        >
          <MaterialIcon name='add' size={20} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default TableTab;