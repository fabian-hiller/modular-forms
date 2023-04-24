import { JSX } from 'solid-js';

export function HashtagIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 39 48"
      role="img"
      aria-label="Hashtag icon"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width={4}
      {...props}
    >
      <path d="m14.69 7.19-4.12 33.63M28.69 7.19l-4.12 33.63M4.29 16.73H35.7m-32.41 14H34.7" />
    </svg>
  );
}
