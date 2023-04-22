import { JSX } from 'solid-js';

export function SearchIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 43 48"
      role="img"
      aria-label="Search icon"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width={4}
      {...props}
    >
      <path d="M18.04 5.75a14.01 14.01 0 1 1-14 14.01 14.01 14.01 0 0 1 14-14.01Zm20.93 36.5-11.59-11.6" />
    </svg>
  );
}
