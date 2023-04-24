import { JSX } from 'solid-js';

export function CloseIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 38 48"
      role="img"
      aria-label="Close icon"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width={4}
      {...props}
    >
      <path d="M34.22 8.78 3.78 39.22m30.44 0L3.78 8.78" />
    </svg>
  );
}
