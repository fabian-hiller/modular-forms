import clsx from 'clsx';
import { ReactNode } from 'react';

type ButtonGroupProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Button group displays multiple related actions side-by-side and helps with
 * arrangement and spacing.
 */
export function ButtonGroup({ className, ...props }: ButtonGroupProps) {
  return (
    <div
      {...props}
      className={clsx('flex flex-wrap gap-6 px-8 lg:gap-8 lg:px-10', className)}
    />
  );
}
