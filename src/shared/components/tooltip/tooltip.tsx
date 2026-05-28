import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type TooltipSide    = 'top' | 'right' | 'bottom' | 'left';
export type TooltipVariant = 'default' | 'sidebar';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: TooltipSide;
  variant?: TooltipVariant;
  /** Extra classes on the trigger wrapper */
  className?: string;
  /** Delay before the tooltip appears, in ms */
  delayMs?: number;
}

// ─── Position calculation ─────────────────────────────────────────────────────

const GAP = 10; // px between trigger edge and bubble

function getCoords(rect: DOMRect, side: TooltipSide) {
  switch (side) {
    case 'right':  return { x: rect.right + GAP,        y: rect.top + rect.height / 2 };
    case 'left':   return { x: rect.left  - GAP,        y: rect.top + rect.height / 2 };
    case 'top':    return { x: rect.left  + rect.width / 2, y: rect.top - GAP };
    case 'bottom': return { x: rect.left  + rect.width / 2, y: rect.bottom + GAP };
  }
}

// CSS transform so the bubble stays anchored relative to the trigger
const TRANSFORM: Record<TooltipSide, string> = {
  right:  'translateY(-50%)',
  left:   'translateY(-50%) translateX(-100%)',
  top:    'translateX(-50%) translateY(-100%)',
  bottom: 'translateX(-50%)',
};

// ─── Caret ────────────────────────────────────────────────────────────────────
// A small rotated square sits on the edge of the bubble facing the trigger.

const CARET_POS: Record<TooltipSide, string> = {
  right:  'right-full top-1/2 -translate-y-1/2 translate-x-1/2',
  left:   'left-full  top-1/2 -translate-y-1/2 -translate-x-1/2',
  top:    'top-full   left-1/2 -translate-x-1/2 -translate-y-1/2',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2',
};

// ─── Variants ─────────────────────────────────────────────────────────────────

const VARIANT_BUBBLE: Record<TooltipVariant, string> = {
  default: 'bg-gray-900 text-white',
  sidebar: 'bg-[var(--color-ink)] border border-white/10 text-white',
};

const VARIANT_CARET: Record<TooltipVariant, string> = {
  default: 'bg-gray-900',
  sidebar: 'bg-[var(--color-ink)]',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Tooltip({
  content,
  children,
  side      = 'top',
  variant   = 'default',
  className = '',
  delayMs   = 0,
}: TooltipProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [coords, setCoords]   = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [ready,   setReady]   = useState(false); // drives opacity so first frame is invisible

  const computeAndShow = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords(getCoords(rect, side));
    setVisible(true);
    // Allow the DOM to paint at opacity-0 before fading in
    requestAnimationFrame(() => setReady(true));
  }, [side]);

  const show = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (delayMs > 0) {
      timerRef.current = setTimeout(computeAndShow, delayMs);
    } else {
      computeAndShow();
    }
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setReady(false);
    // Let the fade-out finish before unmounting
    setTimeout(() => setVisible(false), 150);
  };

  // Clean up timer on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div
      ref={triggerRef}
      className={`inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      {/* Portal — renders into document.body, bypasses any overflow:hidden ancestors */}
      {visible && createPortal(
        <div
          aria-hidden
          className="fixed pointer-events-none z-9999 transition-all duration-150"
          style={{
            top:       coords.y,
            left:      coords.x,
            transform: TRANSFORM[side],
            opacity:   ready ? 1 : 0,
            scale:     ready ? '1' : '0.92',
          }}
        >
          {/* Bubble */}
          <div className={`relative rounded-lg px-2.5 py-1.5 text-[11px] font-semibold whitespace-nowrap ${VARIANT_BUBBLE[variant]}`}>
            {/* Caret arrow */}
            <span
              aria-hidden
              className={`absolute ${CARET_POS[side]} h-2 w-2 rotate-45 overflow-hidden ${VARIANT_CARET[variant]}`}
            />
            {content}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
