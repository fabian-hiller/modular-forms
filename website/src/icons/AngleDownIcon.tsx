import { JSX } from 'solid-js';

export function AngleDownIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 36 48"
      role="img"
      aria-label="Angle down icon"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={4}
      {...props}
    >
      <path d="m4.1 17 13.92 13.96L31.78 17" />
    </svg>
  );
}
