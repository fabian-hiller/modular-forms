import { JSX } from 'solid-js';

export function QwikIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="Qwik icon" {...props}>
      <path
        fill="#18b6f6"
        fill-rule="evenodd"
        d="m24 41.47 16.08 4.96-7.82-7.27-18.99-17.65 4.44-4.44-2.04-14.1L2.54 18.76a5.53 5.53 0 0 0 0 5.53l8.34 14.43a5.53 5.53 0 0 0 4.79 2.76Z"
      />
      <path
        fill="#ac7ef4"
        d="M32.33 1.55H15.67a5.53 5.53 0 0 0-4.8 2.76L2.55 18.75 15.67 2.98 34.73 21.5l-3.55 3.55 1.08 14.1 7.82 7.27a.53.53 0 0 0 .63-.75l-3.59-6.97 8.33-14.43a5.53 5.53 0 0 0 0-5.54L37.12 4.31a5.53 5.53 0 0 0-4.79-2.76Z"
      />
      <path
        fill="#fff"
        d="M34.73 21.51 15.67 2.98l2.04 14.1-4.44 4.43 18.99 17.65-1.08-14.1Z"
      />
    </svg>
  );
}
