import { JSX } from 'solid-js';

export function ArrowRightIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Arrow right icon"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={4}
      {...props}
    >
      <path d="M3.1 23.93h41.13" />
      <path d="M29.51 39.25 44.9 23.91 29.51 8.75" />
    </svg>
  );
}
