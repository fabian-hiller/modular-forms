import { component$ } from '@builder.io/qwik';
import type { FormStore } from '@modular-forms/qwik';
import clsx from 'clsx';
import { useFrozenText } from '~/hooks';
import { Expandable } from './Expandable';

type ResponseProps = {
  of: FormStore<any, any, any>;
};

/**
 * Response text usually used at the end of a form to provide feedback to the
 * user.
 */
export const Response = component$(({ of: form }: ResponseProps) => {
  // Freeze status and message while element collapses to prevent UI from
  // jumping
  const frozenStatus = useFrozenText(
    {
      get value() {
        return form.response.status;
      },
    },
    200
  );
  const frozenMessage = useFrozenText(
    {
      get value() {
        return form.response.message;
      },
    },
    200
  );

  return (
    <Expandable expanded={!!form.response.message}>
      <div
        class={clsx(
          'px-8 md:text-lg lg:px-10 lg:text-xl',
          frozenStatus.value === 'success' &&
            'text-emerald-500 dark:text-emerald-400',
          frozenStatus.value === 'error' && 'text-red-500 dark:text-red-400'
        )}
      >
        {frozenMessage.value}
      </div>
    </Expandable>
  );
});
