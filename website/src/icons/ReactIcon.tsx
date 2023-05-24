import { JSX } from 'solid-js';

export function ReactIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="React icon" {...props}>
      <path
        fill="#149eca"
        d="M24 20.97a4.4 4.4 0 1 1-4.4 4.4 4.4 4.4 0 0 1 4.4-4.4Z"
      />
      <g fill="none" stroke="#149eca" stroke-width={2.5}>
        <path d="M24 15.47c12.15 0 22 4.43 22 9.9s-9.85 9.9-22 9.9-22-4.44-22-9.9 9.85-9.9 22-9.9Z" />
        <path d="M32.58 20.42c6.07 10.52 7.16 21.27 2.42 24s-13.5-3.58-19.57-14.1S8.27 9.05 13 6.32s13.5 3.58 19.58 14.1Z" />
        <path d="M32.57 30.32C26.5 40.84 17.73 47.15 13 44.42s-3.65-13.48 2.42-24S30.26 3.58 35 6.32s3.65 13.47-2.43 24Z" />
      </g>
    </svg>
  );
}
