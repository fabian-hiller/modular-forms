import clsx from 'clsx';
import { ComponentChildren } from 'preact';

type ButtonGroupProps = {
  children: ComponentChildren;
  class?: string;
};

/**
 * Button group displays multiple related actions side-by-side and helps with
 * arrangement and spacing.
 */
export function ButtonGroup(props: ButtonGroupProps) {
  return (
    <div
      {...props}
      class={clsx('flex flex-wrap gap-6 px-8 lg:gap-8 lg:px-10', props.class)}
    />
  );
}
