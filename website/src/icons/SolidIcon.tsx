import { JSX } from 'solid-js';

export function SolidIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 46 48" role="img" aria-label="SolidJS icon" {...props}>
      <defs>
        <linearGradient
          id="Hs3d"
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
          id="9qaP"
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
          id="je2n"
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
          id="pEq2"
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
        d="M43.78 12.86S29.92 2.66 19.2 5l-.78.27a7.43 7.43 0 0 0-3.66 2.35l-.53.78-3.92 6.8 6.8 1.3a13.26 13.26 0 0 0 9.94 1.83l12.02 2.36Z"
      />
      <path
        fill="url(#Hs3d)"
        d="M68.45 11.85S54.6 1.65 43.9 4l-.79.26a7.43 7.43 0 0 0-3.66 2.35l-.52.79L35 14.2l6.8 1.3a13.26 13.26 0 0 0 9.93 1.83l12.02 2.35Z"
        opacity=".3"
        transform="translate(-24.68 1.01)"
      />
      <path
        fill="#518ac8"
        d="m14.77 12.85-1.05.27c-4.44 1.3-5.75 5.48-3.4 9.14a12.38 12.38 0 0 0 12.55 3.92l16.2-5.48s-13.85-10.2-24.3-7.85Z"
      />
      <path
        fill="url(#9qaP)"
        d="m36.19 34-1.05.26c-4.44 1.3-5.75 5.49-3.4 9.15a12.38 12.38 0 0 0 12.55 3.92l16.2-5.49S46.64 31.65 36.19 34Z"
        opacity=".3"
        transform="translate(-21.42 -21.15)"
      />
      <path
        fill="url(#je2n)"
        d="M37.98 67.53a11.76 11.76 0 0 0-12.55-3.92l-16.2 5.23L4 77.98l29.27 4.97 5.23-9.4c1.05-1.84.78-3.93-.52-6.02Z"
        transform="translate(-1.78 -42.91)"
      />
      <path
        fill="url(#pEq2)"
        d="M32.75 102.53a11.76 11.76 0 0 0-12.55-3.92L4 103.84s13.85 10.45 24.57 7.84l.78-.26c4.45-1.31 6.01-5.5 3.4-8.89Z"
        transform="translate(-1.78 -68.76)"
      />
    </svg>
  );
}
