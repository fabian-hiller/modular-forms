import { JSX } from 'solid-js';

export function QwikIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 44 48" role="img" aria-label="Qwik icon" {...props}>
      <path
        fill="#18b6f6"
        fill-rule="evenodd"
        d="m22 40 14.31 4.41-6.96-6.47-16.9-15.7 3.95-3.96-1.8-12.54L2.9 19.77a4.92 4.92 0 0 0 0 4.93l7.41 12.84A4.92 4.92 0 0 0 14.6 40Z"
      />
      <path
        fill="#ac7ef4"
        d="M29.42 4.47H14.59a4.92 4.92 0 0 0-4.27 2.46L2.91 19.77 14.59 5.74l16.96 16.5-3.16 3.16.97 12.54 6.96 6.47a.47.47 0 0 0 .56-.67l-3.2-6.2L41.1 24.7a4.92 4.92 0 0 0 0-4.93L33.68 6.93a4.92 4.92 0 0 0-4.26-2.46Z"
      />
      <path
        fill="#fff"
        d="M31.55 22.23 14.58 5.74l1.82 12.54-3.95 3.95 16.9 15.71-.96-12.54Z"
      />
    </svg>
  );
}
