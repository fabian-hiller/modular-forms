import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { isBrowser } from '@builder.io/qwik/build';
import type { FormResponse, FormStore } from '@modular-forms/qwik';
import clsx from 'clsx';
import { Expandable } from './Expandable';

type ResponseProps = {
  of: FormStore<any, any>;
  class?: string;
};

/**
 * Response text usually used at the end of a form to provide feedback to the
 * user.
 */
export const Response = component$(({ of: form, ...props }: ResponseProps) => {
  // Use frozen response signal
  const frozenResponse = useSignal<FormResponse<any>>();

  // Freeze response while element collapses to prevent UI from jumping
  useTask$(({ track, cleanup }) => {
    const nextResponse = track(() => form.response);
    if (isBrowser && !nextResponse) {
      const timeout = setTimeout(
        () => (frozenResponse.value = nextResponse),
        200
      );
      cleanup(() => clearTimeout(timeout));
    } else {
      frozenResponse.value = nextResponse;
    }
  });

  return (
    <Expandable expanded={!!form.response.message}>
      <div
        class={clsx(
          'px-8 md:text-lg lg:px-10 lg:text-xl',
          frozenResponse.value?.status === 'success' &&
            'text-emerald-500 dark:text-emerald-400',
          frozenResponse.value?.status === 'error' &&
            'text-red-500 dark:text-red-400',
          props.class
        )}
      >
        {frozenResponse.value?.message}
      </div>
    </Expandable>
  );
});
