import { JSX } from 'solid-js';

export function SearchIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 45 48"
      role="img"
      aria-label="Search icon"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width={4}
      {...props}
    >
      <path d="M19 5.48A14.22 14.22 0 1 1 4.76 19.7 14.22 14.22 0 0 1 19 5.48Zm21.23 37.04L28.47 30.75" />
    </svg>
  );
}
