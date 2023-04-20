import { JSX } from 'solid-js';

export function SunIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Sun icon"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={4}
      {...props}
    >
      <path d="M23.98 16.11a7.9 7.9 0 1 1-7.91 7.9 7.9 7.9 0 0 1 7.9-7.9Z" />
      <path d="M23.98 1.55v6.27m22.47 16.2h-6.27m-32.4 0H1.51m22.47 16.2v6.27M8.93 39.1l3.71-3.69m26.44 3.79-3.7-3.68m3.75-26.56-3.7 3.69m-22.95 0-3.7-3.69" />
    </svg>
  );
}
