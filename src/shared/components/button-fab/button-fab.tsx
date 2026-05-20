import { FunctionComponent } from 'react';
import { Plus, type LucideIcon } from '@/src/shared/components/material-icon/material-lucide-icons';

export interface FabProps {
  onClick: () => void;
  ariaLabel: string;
  icon?: LucideIcon;
  className?: string;
}

/**
 * Mobile-only floating action button.
 * Renders fixed at the bottom-right of the viewport.
 * Hidden on lg+ screens — use the page/table action button there instead.
 */
const ButtonFab: FunctionComponent<FabProps> = ({
  onClick,
  ariaLabel,
  icon: Icon = Plus,
  className = ''
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`button-fab btn-fab lg:hidden fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-black text-white shadow-xl
        hover:bg-gray-800 active:scale-95 transition-all duration-150 flex items-center justify-center ${className}`}
    >
      <Icon size={22} strokeWidth={2.5} />
    </button>
  );
}

export default ButtonFab;
