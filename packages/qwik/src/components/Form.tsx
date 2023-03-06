import type { QwikSubmitEvent, QwikJSX, PropFunction } from '@builder.io/qwik';
import type { ActionStore } from '@builder.io/qwik-city';
import type { JSX } from '@builder.io/qwik/jsx-runtime';
import { getValues, validate } from '../methods';
import type {
  FormStore,
  FieldValues,
  FieldPath,
  FieldArrayPath,
} from '../types';

export type FormProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = Omit<QwikJSX.IntrinsicElements['form'], 'action' | 'method'> & {
  of: FormStore<TFieldValues, TFieldName, TFieldArrayName>;
  action?: ActionStore<any, TFieldValues, true>; // TODO: Improve generics
  onSubmit$?: PropFunction<
    (values: TFieldValues, event: QwikSubmitEvent<HTMLFormElement>) => unknown
  >;
  keepResponse?: boolean;
  shouldActive?: boolean;
  shouldTouched?: boolean;
  shouldDirty?: boolean;
  shouldFocus?: boolean;
};

/**
 * Form element that takes care of validation and simplifies submission.
 */
export function Form<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>({
  of: form,
  action,
  onSubmit$,
  keepResponse,
  shouldActive,
  shouldTouched,
  shouldDirty,
  shouldFocus,
  ...rest
}: FormProps<TFieldValues, TFieldName, TFieldArrayName>): JSX.Element {
  return (
    <form
      {...rest}
      method="post"
      action={action?.actionPath}
      preventdefault:submit
      noValidate
      ref={() => {
        // TODO: Enable once issue #3219 is fixed
        // form.element = element as HTMLFormElement;
      }}
      onSubmit$={async (event: QwikSubmitEvent<HTMLFormElement>) => {
        // Reset response if it is not to be kept
        if (!keepResponse) {
          form.response = {};
        }

        // Increase submit count and set submitted and submitting to "true"
        form.submitCount++;
        form.submitted = true;
        form.submitting = true;

        // Try to run submit actions if form is valid
        try {
          if (await validate(form, { shouldActive, shouldFocus })) {
            // Get current values of form
            const values = getValues(form, {
              shouldActive,
              shouldTouched,
              shouldDirty,
            }) as TFieldValues;

            // Run submit actions of form
            await Promise.all([
              onSubmit$?.(values, event),
              action?.run(values),
            ]);

            // TODO: Catch errors of "action"
          }

          // If an error occurred, set error response
        } catch (error: any) {
          form.response = {
            status: 'error',
            message: error?.message || 'An unknown error has occurred.',
          };

          // Finally set submitting back to "false"
        } finally {
          form.submitting = false;
        }
      }}
    />
  );
}
