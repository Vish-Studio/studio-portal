import { FunctionComponent } from 'react';

// ─── Size scale ───────────────────────────────────────────────────────────────

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

const SIZE: Record<AvatarSize, { box: string; text: string; border: string }> = {
  xs: { box: 'w-6 h-6',  text: 'text-[9px]',  border: 'border-[1.5px]' },
  sm: { box: 'w-7 h-7',  text: 'text-[10px]', border: 'border-2'       },
  md: { box: 'w-9 h-9',  text: 'text-[12px]', border: 'border-2'       },
  lg: { box: 'w-11 h-11', text: 'text-[14px]', border: 'border-2'      },
};

// ─── Deterministic colour from any string seed ────────────────────────────────

const PALETTE = [
  'bg-violet-500', 'bg-blue-500',    'bg-emerald-500',
  'bg-orange-500', 'bg-pink-500',    'bg-cyan-500',
  'bg-amber-500',  'bg-rose-500',    'bg-indigo-500',
];

export const avatarColor = (seed: string): string =>
  PALETTE[seed.charCodeAt(seed.length - 1) % PALETTE.length];

// ─── Initials helper ──────────────────────────────────────────────────────────

export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

export interface AvatarProps {
  name: string;
  /** Stable seed for colour — defaults to name. Use entity id for consistency. */
  id?: string;
  size?: AvatarSize;
  /** Adds a white border — use when stacking multiple avatars. */
  bordered?: boolean;
  className?: string;
}

const Avatar: FunctionComponent<AvatarProps> = ({
  name,
  id,
  size = 'md',
  bordered = false,
  className = '',
}) => {
  const { box, text, border } = SIZE[size];
  const bg = avatarColor(id ?? name);

  return (
    <div
      title={name}
      className={`${box} ${bg} rounded-full flex items-center justify-center shrink-0 text-white font-bold ${
        bordered ? `${border} border-white` : ''
      } ${className}`}
    >
      <span className={text}>{getInitials(name)}</span>
    </div>
  );
};

// ─── AvatarStack ──────────────────────────────────────────────────────────────

export interface AvatarStackMember {
  name: string;
  id?: string;
}

export interface AvatarStackProps {
  members: AvatarStackMember[];
  size?: AvatarSize;
  limit?: number;
}

export const AvatarStack: FunctionComponent<AvatarStackProps> = ({
  members,
  size = 'xs',
  limit = 3,
}) => {
  const visible  = members.slice(0, limit);
  const overflow = members.length - visible.length;
  const { box, text, border } = SIZE[size];

  return (
    <div className="flex -space-x-1.5">
      {visible.map((m, i) => (
        <Avatar key={m.id ?? i} name={m.name} id={m.id} size={size} bordered />
      ))}
      {overflow > 0 && (
        <div
          className={`${box} rounded-full bg-gray-100 flex items-center justify-center ${border} border-white shrink-0`}
        >
          <span className={`${text} font-bold text-gray-500`}>+{overflow}</span>
        </div>
      )}
    </div>
  );
};

export default Avatar;
