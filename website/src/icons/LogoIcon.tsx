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
      fill="currentColor"
      {...others}
    >
      <path d="M0 0h48v48H0Z" opacity=".15" />
      <path d="M0 0h21v48H0Z" opacity=".4" />
      <path d="M0 27h48v21H0Z" opacity=".6" />
      <path class="text-yellow-300" d="M27 0h21v21H27Z" opacity=".5" />
    </svg>
  );
}
