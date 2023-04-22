import clsx from 'clsx';
import { JSX, splitProps } from 'solid-js';

export function LogoIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  const [, others] = splitProps(props, ['class']);
  return (
    <svg
      class={clsx('animate-logo', props.class)}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Modular Forms icon"
      {...others}
    >
      <path fill="currentColor" d="M3.9 3.9h40.2v40.2H3.9Z" opacity=".15" />
      <path fill="currentColor" d="M3.9 3.9h17.6v40.2H3.9Z" opacity=".4" />
      <path fill="currentColor" d="M3.9 26.51h40.2v17.6H3.9Z" opacity=".6" />
      <path
        class="text-yellow-300"
        fill="currentColor"
        d="M26.51 3.9h17.6v17.6h-17.6Z"
        opacity=".5"
      />
    </svg>
  );
}
