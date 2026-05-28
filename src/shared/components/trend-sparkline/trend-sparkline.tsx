import type { SVGProps } from 'react';

export type TrendSparklineVariant = 'positive' | 'negative' | 'neutral' | 'warning' | 'accent';

export interface TrendSparklineProps extends Omit<SVGProps<SVGSVGElement>, 'data'> {
  data?: number[];
  variant?: TrendSparklineVariant;
  width?: number;
  height?: number;
  showFill?: boolean;
}

const VARIANT_COLOR: Record<TrendSparklineVariant, string> = {
  positive: '#22c55e',
  negative: '#ef4444',
  neutral: '#64748b',
  warning: '#d6b400',
  accent: 'var(--color-accent-lime)',
};

const DEFAULT_DATA: Record<TrendSparklineVariant, number[]> = {
  positive: [18, 28, 24, 36, 40, 52, 47],
  negative: [52, 44, 48, 36, 32, 26, 20],
  neutral: [30, 34, 31, 36, 33, 35, 34],
  warning: [20, 40, 30, 48, 38, 56, 44],
  accent: [22, 34, 31, 45, 42, 58, 50],
};

const inferVariant = (values: number[]): TrendSparklineVariant => {
  const first = values[0] ?? 0;
  const last = values.at(-1) ?? first;
  const delta = last - first;

  if (Math.abs(delta) < 4) return 'neutral';
  return delta > 0 ? 'positive' : 'negative';
};

const hasVisibleBend = (values: number[]) => {
  if (values.length < 3) return false;

  return values.slice(1, -1).some((value, index) => {
    const previous = values[index];
    const next = values[index + 2];
    return Math.abs(value * 2 - previous - next) > 0.5;
  });
};

const addCurveRhythm = (values: number[], variant: TrendSparklineVariant) => {
  if (variant === 'neutral' || values.length < 3 || hasVisibleBend(values)) return values;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const direction = values.at(-1)! >= values[0]! ? 1 : -1;
  const amplitude = range * (variant === 'warning' ? 0.22 : 0.16);

  return values.map((value, index) => {
    if (index === 0 || index === values.length - 1) return value;

    const wave = index % 2 === 0 ? 1 : -1;
    return value + wave * amplitude * direction;
  });
};

const toPoints = (values: number[], width: number, height: number) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const verticalPadding = 6;
  const usableHeight = height - verticalPadding * 2;

  return values.map((value, index) => ({
    x: index * step,
    y: height - verticalPadding - ((value - min) / range) * usableHeight,
  }));
};

const buildLinearPath = (values: number[], width: number, height: number) =>
  toPoints(values, width, height)
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');

const buildSmoothPath = (values: number[], width: number, height: number) => {
  const points = toPoints(values, width, height);
  if (points.length < 2) return buildLinearPath(values, width, height);

  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;

    const previous = points[index - 1];
    const controlX = previous.x + (point.x - previous.x) / 2;
    return `${path} C ${controlX.toFixed(2)} ${previous.y.toFixed(2)}, ${controlX.toFixed(2)} ${point.y.toFixed(2)}, ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }, '');
};

const TrendSparkline = ({
  data,
  variant,
  width = 132,
  height = 56,
  showFill = true,
  className = '',
  ...props
}: TrendSparklineProps) => {
  const resolvedVariant = variant ?? inferVariant(data ?? DEFAULT_DATA.accent);
  const values = addCurveRhythm(data && data.length > 0 ? data : DEFAULT_DATA[resolvedVariant], resolvedVariant);
  const color = VARIANT_COLOR[resolvedVariant];
  const paint = `var(--trend-sparkline-color, ${color})`;
  const linePath = resolvedVariant === 'neutral'
    ? buildLinearPath(values, width, height)
    : buildSmoothPath(values, width, height);
  const fillPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      {...props}
    >
      {showFill && <path d={fillPath} fill={paint} opacity="0.1" />}
      <path
        d={linePath}
        fill="none"
        stroke={paint}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TrendSparkline;
