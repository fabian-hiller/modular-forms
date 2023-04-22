import { JSX } from 'solid-js';

export function SolidIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="SolidJS icon" {...props}>
      <defs>
        <linearGradient
          id="R3t0"
          x1="-.06"
          x2=".91"
          y1="-.01"
          y2=".98"
          gradientUnits="objectBoundingBox"
        >
          <stop offset=".1" stop-color="#76b3e1" />
          <stop offset=".3" stop-color="#dcf2fd" />
          <stop offset="1" stop-color="#76b3e1" />
        </linearGradient>
        <linearGradient
          id="Gk21"
          x1=".57"
          x2=".38"
          y1="-.02"
          y2="1.33"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stop-color="#76b3e1" />
          <stop offset=".5" stop-color="#4377bb" />
          <stop offset="1" stop-color="#1f3b77" />
        </linearGradient>
        <linearGradient
          id="A713"
          x1=".11"
          x2="1.04"
          y1=".01"
          y2="1.14"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stop-color="#315aa9" />
          <stop offset=".5" stop-color="#518ac8" />
          <stop offset="1" stop-color="#315aa9" />
        </linearGradient>
        <linearGradient
          id="lF69"
          x1=".62"
          x2=".18"
          y1="-.44"
          y2="3.04"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stop-color="#4377bb" />
          <stop offset=".5" stop-color="#1a336b" />
          <stop offset="1" stop-color="#1a336b" />
        </linearGradient>
      </defs>
      <path
        fill="#76b3e1"
        d="M47.35 11.48S31.78.02 19.75 2.68l-.89.29a8.35 8.35 0 0 0-4.11 2.64l-.59.88-4.4 7.63 7.63 1.47a14.9 14.9 0 0 0 11.16 2.06l13.5 2.64Z"
      />
      <path
        fill="url(#R3t0)"
        d="M72.59 12.86S57.02 1.4 44.99 4.05l-.89.3A8.35 8.35 0 0 0 40 6.97l-.6.89L35 15.5l7.63 1.47a14.9 14.9 0 0 0 11.16 2.05l13.51 2.65Z"
        opacity=".3"
        transform="translate(-25.24 -1.37)"
      />
      <path
        fill="#518ac8"
        d="m14.75 11.48-1.18.3c-4.99 1.46-6.46 6.16-3.81 10.27 2.93 3.82 9.1 5.88 14.1 4.4l18.2-6.16S26.5 8.83 14.75 11.49Z"
      />
      <path
        fill="url(#Gk21)"
        d="m36.88 34.05-1.18.3c-4.99 1.46-6.46 6.16-3.81 10.27 2.93 3.82 9.1 5.87 14.1 4.4l18.2-6.17s-15.56-11.45-27.31-8.8Z"
        opacity=".3"
        transform="translate(-22.13 -22.57)"
      />
      <path
        fill="url(#A713)"
        d="M42.17 68.08a13.21 13.21 0 0 0-14.1-4.4l-18.2 5.86L4 79.82l32.89 5.58 5.87-10.57c1.18-2.06.88-4.4-.59-6.75Z"
        transform="translate(-3.34 -43.38)"
      />
      <path
        fill="url(#lF69)"
        d="M36.3 103.08a13.21 13.21 0 0 0-14.1-4.4L4 104.54s15.56 11.75 27.6 8.81l.88-.29c5-1.47 6.76-6.17 3.82-9.98Z"
        transform="translate(-3.34 -68.1)"
      />
    </svg>
  );
}
