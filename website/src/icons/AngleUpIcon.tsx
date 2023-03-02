import { JSX } from 'solid-js';

export function AngleUpIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 36 48" role="img" aria-label="Angle up icon" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={4}
        d="M4.15 30.96 18.07 17l13.76 13.96"
      />
    </svg>
  );
}
