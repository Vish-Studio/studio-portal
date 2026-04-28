import { FunctionComponent } from 'react';
import { Plus } from 'lucide-react';

export interface FabProps {
  onClick: () => void;
  ariaLabel: string;
  className?: string;
}

/**
 * Mobile-only floating action button.
 * Renders fixed at the bottom-right of the viewport.
 * Hidden on sm+ screens — use the TableToolbar action button there instead.
 */
const ButtonFab: FunctionComponent<FabProps> = ({
  onClick,
  ariaLabel,
  className = ''
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`btn-fab sm:hidden fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-black text-white shadow-xl
        hover:bg-gray-800 active:scale-95 transition-all duration-150 flex items-center justify-center ${className}`}
    >
      <Plus size={22} strokeWidth={2.5} />
    </button>
  );
}

export default ButtonFab;