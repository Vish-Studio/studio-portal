import type { ReactNode } from 'react';

type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: TooltipSide;
  className?: string;
}

const SIDE_CLASSES: Record<TooltipSide, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export default function Tooltip({ content, children, side = 'top', className = '' }: TooltipProps) {
  return (
    <div className={`group/tooltip relative inline-flex ${className}`}>
      {children}
      <div
        className={`pointer-events-none absolute z-50 ${SIDE_CLASSES[side]}
          opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150`}
      >
        <span className="block bg-(--color-ink) text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
          {content}
        </span>
      </div>
    </div>
  );
}
