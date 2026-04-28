import { FunctionComponent } from 'react';

// ─── Variants ─────────────────────────────────────────────────────────────────

export type StatusVariant = 'green' | 'amber' | 'red' | 'gray' | 'blue' | 'purple' | 'violet';

interface VariantTokens {
  badge: string;
  dot:   string;
}

const VARIANT_STYLES: Record<StatusVariant, VariantTokens> = {
  green:  { badge: 'bg-green-50  text-green-700  border border-green-200',  dot: 'bg-green-500'  },
  amber:  { badge: 'bg-amber-50  text-amber-700  border border-amber-200',  dot: 'bg-amber-500'  },
  red:    { badge: 'bg-red-50    text-red-600    border border-red-200',    dot: 'bg-red-500'    },
  gray:   { badge: 'bg-gray-100  text-gray-500   border border-gray-200',   dot: 'bg-gray-400'   },
  blue:   { badge: 'bg-blue-50   text-blue-700   border border-blue-200',   dot: 'bg-blue-500'   },
  purple: { badge: 'bg-purple-50 text-purple-700 border border-purple-200', dot: 'bg-purple-500' },
  violet: { badge: 'bg-violet-50 text-violet-700 border border-violet-200', dot: 'bg-violet-500' },
};

// ─── StatusBadge ─────────────────────────────────────────────────────────────
// Rounded-square chip: uses rounded-[6px] instead of rounded-full.
// The indicator is a small 1.5×1.5 rounded-xs square (not a circle).

export interface StatusBadgeProps {
  label:     string;
  variant:   StatusVariant;
  className?: string;
}

const StatusBadge: FunctionComponent<StatusBadgeProps> = ({ label, variant, className = '' }) => {
  const s = VARIANT_STYLES[variant];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[6px] leading-5 ${s.badge} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-xs shrink-0 ${s.dot}`} />
      {label}
    </span>
  );
};

export default StatusBadge;

// ─── Client status helpers ────────────────────────────────────────────────────

import type { ClientStatus } from '@/src/data/clients';

export const CLIENT_STATUS_VARIANT: Record<ClientStatus, StatusVariant> = {
  active:   'green',
  inactive: 'amber',
  lost:     'red',
};

export const ClientStatusBadge = ({ status }: { status: ClientStatus }) => (
  <StatusBadge label={status} variant={CLIENT_STATUS_VARIANT[status]} />
);

// ─── Project status helpers ───────────────────────────────────────────────────

export type ProjectStatus = 'active' | 'completed' | 'paused';

export const PROJECT_STATUS_VARIANT: Record<ProjectStatus, StatusVariant> = {
  active:    'green',
  paused:    'amber',
  completed: 'gray',
};

export const ProjectStatusBadge = ({ status }: { status: ProjectStatus }) => (
  <StatusBadge label={status} variant={PROJECT_STATUS_VARIANT[status]} />
);

// ─── Task status helpers ──────────────────────────────────────────────────────

export type TaskStatus = 'todo' | 'in-progress' | 'to-test' | 'completed';

export const TASK_STATUS_VARIANT: Record<TaskStatus, StatusVariant> = {
  'todo':        'gray',
  'in-progress': 'blue',
  'to-test':     'amber',
  'completed':   'green',
};

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  'todo':        'Todo',
  'in-progress': 'In Progress',
  'to-test':     'To Test',
  'completed':   'Completed',
};

export const TaskStatusBadge = ({ status }: { status: TaskStatus }) => (
  <StatusBadge label={TASK_STATUS_LABEL[status]} variant={TASK_STATUS_VARIANT[status]} />
);
