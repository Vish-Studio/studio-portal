import { FunctionComponent } from 'react';

// ─── Size scale ───────────────────────────────────────────────────────────────

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE: Record<AvatarSize, { box: string; text: string; border: string }> = {
  xs: { box: 'w-6 h-6',   text: 'text-[9px]',  border: 'border-[1.5px]' },
  sm: { box: 'w-7 h-7',   text: 'text-[10px]', border: 'border-2'       },
  md: { box: 'w-9 h-9',   text: 'text-[12px]', border: 'border-2'       },
  lg: { box: 'w-11 h-11', text: 'text-[14px]', border: 'border-2'       },
  xl: { box: 'w-24 h-24', text: 'text-4xl',    border: 'border-4'       },
};

// ─── Deterministic colour from any string seed ────────────────────────────────

export type AvatarTone = 'lime' | 'emerald' | 'sky' | 'violet' | 'rose' | 'amber';

const AVATAR_TONES: AvatarTone[] = ['lime', 'emerald', 'sky', 'violet', 'rose', 'amber'];

const PALETTE: Record<AvatarTone, string> = {
  lime: 'bg-lime-700',
  emerald: 'bg-emerald-600',
  sky: 'bg-sky-600',
  violet: 'bg-violet-600',
  rose: 'bg-rose-600',
  amber: 'bg-amber-500',
};

const isAvatarTone = (value: string): value is AvatarTone =>
  AVATAR_TONES.includes(value as AvatarTone);

export const avatarTone = (seed: string): AvatarTone => {
  const safeSeed = seed.trim() || 'avatar';
  const index = [...safeSeed].reduce((sum, char) => sum + char.charCodeAt(0), 0) % AVATAR_TONES.length;
  return AVATAR_TONES[index];
};

export const randomAvatarTone = (): AvatarTone => {
  const random = globalThis.crypto?.getRandomValues
    ? globalThis.crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32
    : Math.random();

  return AVATAR_TONES[Math.floor(random * AVATAR_TONES.length)];
};

export const avatarColor = (seedOrTone: string): string =>
  PALETTE[isAvatarTone(seedOrTone) ? seedOrTone : avatarTone(seedOrTone)];

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
  /** Persisted tone key created with the user record. Falls back to id/name. */
  color?: string;
  size?: AvatarSize;
  /** Adds a white border — use when stacking multiple avatars. */
  bordered?: boolean;
  className?: string;
}

const Avatar: FunctionComponent<AvatarProps> = ({
  name,
  id,
  color,
  size = 'md',
  bordered = false,
  className = '',
}) => {
  const { box, text, border } = SIZE[size];
  const bg = avatarColor(color || id || name);

  return (
    <div
      title={name}
      className={`avatar ${box} ${bg} rounded-full flex items-center justify-center shrink-0 text-white font-bold ${
        bordered ? `${border} border-white` : ''
      } ${className}`}
    >
      <span className={`avatar-initials ${text}`}>{getInitials(name)}</span>
    </div>
  );
};

// ─── AvatarStack ──────────────────────────────────────────────────────────────

export interface AvatarStackMember {
  name: string;
  id?: string;
  color?: string;
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
    <div className="avatar-stack flex -space-x-1.5">
      {visible.map((m, i) => (
        <Avatar key={m.id ?? i} name={m.name} id={m.id} color={m.color} size={size} bordered />
      ))}
      {overflow > 0 && (
        <div
          className={`avatar-stack-overflow ${box} rounded-full bg-gray-100 flex items-center justify-center ${border} border-white shrink-0`}
        >
          <span className={`avatar-stack-count ${text} font-bold text-gray-500`}>+{overflow}</span>
        </div>
      )}
    </div>
  );
};

export default Avatar;
