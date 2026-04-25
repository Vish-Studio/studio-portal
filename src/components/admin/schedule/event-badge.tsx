import React from 'react';
import MaterialIcon from '../../common/material-icon/material-icon';
import { type EventType, EVENT_TYPE_CONFIG } from './event-types';

export type BadgeVariant = 'pill' | 'compact' | 'icon' | 'dot';

interface EventBadgeProps {
  type: EventType;
  variant?: BadgeVariant;
  className?: string;
}

export default function EventBadge({ type, variant = 'pill', className = '' }: EventBadgeProps) {
  const config = EVENT_TYPE_CONFIG[type];

  if (variant === 'dot') {
    return (
      <div className={`w-2 h-2 rounded-full shrink-0 ${config.dotClass} ${className}`} />
    );
  }

  if (variant === 'icon') {
    return (
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${config.iconBgClass} ${config.textClass} ${className}`}
      >
        <MaterialIcon name={config.icon} size={16} />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${config.bgClass} ${config.textClass} ${className}`}
      >
        <MaterialIcon name={config.icon} size={12} />
        {config.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bgClass} ${config.textClass} ${className}`}
    >
      <MaterialIcon name={config.icon} size={14} />
      {config.label}
    </span>
  );
}
