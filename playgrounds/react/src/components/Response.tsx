import type { FormStore } from '@modular-forms/react';
import clsx from 'clsx';
import { Expandable } from './Expandable';

type ResponseProps = {
  of: FormStore<any, any>;
  className?: string;
};

/**
 * Response text usually used at the end of a form to provide feedback to the
 * user.
 */
export function Response({ className, of: form, ...props }: ResponseProps) {
  return (
    <Expandable expanded={!!form.response.value.message}>
      <div
        className={clsx(
          'px-8 md:text-lg lg:px-10 lg:text-xl',
          form.response.value.status === 'success' &&
            'text-emerald-500 dark:text-emerald-400',
          form.response.value.status === 'error' &&
            'text-red-500 dark:text-red-400',
          className
        )}
      >
        {form.response.value.message}
      </div>
    </Expandable>
  );
}
