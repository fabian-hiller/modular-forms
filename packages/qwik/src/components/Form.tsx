import type { QwikJSX } from '@builder.io/qwik';
import type { ActionStore } from '@builder.io/qwik-city';
import type { JSX } from '@builder.io/qwik/jsx-runtime';
import { getValues, setError, validate } from '../methods';
import type {
  FormStore,
  FieldValues,
  FieldPath,
  FieldArrayPath,
  SubmitHandler,
  FormActionState,
  PartialValues,
} from '../types';

export type FormProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = Omit<QwikJSX.IntrinsicElements['form'], 'action' | 'method'> & {
  of: FormStore<TFieldValues, TFieldName, TFieldArrayName>;
  action?: ActionStore<
    FormActionState<TFieldValues>,
    PartialValues<TFieldValues>,
    true
  >;
  onSubmit$?: SubmitHandler<TFieldValues>;
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
  ...formProps
}: FormProps<TFieldValues, TFieldName, TFieldArrayName>): JSX.Element {
  // Destructure form props
  const { encType } = formProps;

  // Create options object
  const options = { shouldActive, shouldTouched, shouldDirty, shouldFocus };

  return (
    <form
      {...formProps}
      method="post"
      action={action?.actionPath}
      preventdefault:submit
      noValidate
      ref={() => {
        // TODO: Enable once issue #3219 is fixed
        // form.element = element as HTMLFormElement;
      }}
      onSubmit$={async (event, element) => {
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
          if (await validate(form, options)) {
            // Get current values of form
            const values = getValues(form, options);

            // Run submit actions of form
            const [actionResult] = await Promise.all([
              action?.run(
                encType === 'multipart/form-data'
                  ? new FormData(element)
                  : values
              ),
              onSubmit$?.(values as TFieldValues, event),
            ]);

            // Destructure action result
            const { errors, response } = actionResult?.value || {};

            // Set errors of action if necessary
            if (errors) {
              (
                Object.entries(errors) as [
                  TFieldName | TFieldArrayName,
                  string
                ][]
              ).forEach(([name, error]) =>
                setError(form, name, error, {
                  ...options,
                  shouldFocus: false,
                })
              );
            }

            // Set response of action if necessary
            if (response) {
              form.response = response;
            }
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
