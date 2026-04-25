import React from 'react';

interface MaterialIconProps {
  name: string;
  size?: number;
  fill?: boolean;
  className?: string;
}

export default function MaterialIcon({ name, size = 20, fill = false, className = '' }: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-rounded select-none leading-none ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      }}
    >
      {name}
    </span>
  );
}
