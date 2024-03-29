import clsx from 'clsx';
import { JSX } from 'solid-js';

type ButtonGroupProps = {
  class?: string;
  children: JSX.Element;
};

/**
 * Button group displays multiple related actions side-by-side and helps with
 * arrangement and spacing.
 */
export function ButtonGroup(props: ButtonGroupProps) {
  return (
    <div class={clsx('flex flex-wrap gap-6 lg:gap-8', props.class)}>
      {props.children}
    </div>
  );
}
