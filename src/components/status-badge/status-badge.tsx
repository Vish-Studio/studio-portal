import React from 'react';

// ─── Variants ─────────────────────────────────────────────────────────────────

export type StatusVariant = 'green' | 'amber' | 'red' | 'gray' | 'blue' | 'purple' | 'violet';

const VARIANT_STYLES: Record<StatusVariant, { badge: string; dot: string }> = {
  green:  { badge: 'bg-green-50 text-green-700',  dot: 'bg-green-400'  },
  amber:  { badge: 'bg-amber-50 text-amber-700',  dot: 'bg-amber-400'  },
  red:    { badge: 'bg-red-50 text-red-600',      dot: 'bg-red-400'    },
  gray:   { badge: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400'   },
  blue:   { badge: 'bg-blue-50 text-blue-700',    dot: 'bg-blue-400'   },
  purple: { badge: 'bg-purple-50 text-purple-700',dot: 'bg-purple-400' },
  violet: { badge: 'bg-violet-50 text-violet-700',dot: 'bg-violet-400' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export interface StatusBadgeProps {
  label: string;
  variant: StatusVariant;
  className?: string;
}

export default function StatusBadge({ label, variant, className = '' }: StatusBadgeProps) {
  const s = VARIANT_STYLES[variant];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${s.badge} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      {label}
    </span>
  );
}

// ─── Client status helpers ────────────────────────────────────────────────────

import type { ClientStatus } from '../../data/clients';

export const CLIENT_STATUS_VARIANT: Record<ClientStatus, StatusVariant> = {
  active:   'green',
  inactive: 'amber',
  lost:     'red',
};

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  return <StatusBadge label={status} variant={CLIENT_STATUS_VARIANT[status]} />;
}

// ─── Project status helpers ───────────────────────────────────────────────────

export type ProjectStatus = 'active' | 'completed' | 'paused';

export const PROJECT_STATUS_VARIANT: Record<ProjectStatus, StatusVariant> = {
  active:    'green',
  paused:    'amber',
  completed: 'gray',
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return <StatusBadge label={status} variant={PROJECT_STATUS_VARIANT[status]} />;
}
