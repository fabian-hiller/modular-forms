import { JSX } from 'solid-js';

export function ArrowLeftIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Arrow left icon"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={4}
      {...props}
    >
      <path d="M44.9 23.93H3.77" />
      <path d="M18.48 39.25 3.1 23.91 18.48 8.75" />
    </svg>
  );
}
