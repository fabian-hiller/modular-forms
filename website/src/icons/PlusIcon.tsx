import { JSX } from 'solid-js';

export function PlusIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Plus icon"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width={4}
      {...props}
    >
      <path d="M24 2.9v42.2M45.1 24H2.9" />
    </svg>
  );
}
