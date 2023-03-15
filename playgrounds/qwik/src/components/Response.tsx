import { component$ } from '@builder.io/qwik';
import type { FormResponse } from '@modular-forms/qwik';
import clsx from 'clsx';
import { useFrozenText } from '~/hooks';
import { Expandable } from './Expandable';

type ResponseProps = FormResponse;

/**
 * Response text usually used at the end of a form to provide feedback to the
 * user.
 */
export const Response = component$(({ status, message }: ResponseProps) => {
  // Freeze message while element collapses to prevent UI from jumping
  const frozenMessage = useFrozenText(
    {
      get value() {
        return message;
      },
    },
    200
  );

  return (
    <Expandable expanded={!!message}>
      <div
        class={clsx(
          'px-8 md:text-lg lg:px-10 lg:text-xl',
          status === 'success' && 'text-emerald-500 dark:text-emerald-400',
          status === 'error' && 'text-red-500 dark:text-red-400'
        )}
      >
        {frozenMessage.value}
      </div>
    </Expandable>
  );
});
