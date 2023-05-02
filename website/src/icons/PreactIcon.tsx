import { JSX } from 'solid-js';

export function PreactIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="Preact icon" {...props}>
      <path
        fill="#673ab8"
        d="m24 .94 19.97 11.53v23.06L24 47.06 4.03 35.53V12.47Z"
      />
      <path
        fill="none"
        stroke="#fff"
        stroke-width="2"
        d="M37.91 13.13c2.3 2.94-2.07 10.19-9.75 16.2s-15.78 8.48-18.07 5.54 2.07-10.19 9.75-16.2 15.78-8.48 18.07-5.54Z"
      />
      <path
        fill="none"
        stroke="#fff"
        stroke-width="2"
        d="M10.09 13.13c2.3-2.94 10.38-.46 18.07 5.55s12.05 13.25 9.75 16.2-10.39.45-18.07-5.56-12.05-13.25-9.75-16.2Z"
      />
      <path
        fill="#fff"
        d="M24 20.94A3.06 3.06 0 1 1 20.94 24 3.06 3.06 0 0 1 24 20.94Z"
      />
    </svg>
  );
}
