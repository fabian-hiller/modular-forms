import type { QwikSubmitEvent } from '@builder.io/qwik';
import type { ActionStore } from '@builder.io/qwik-city';
import type { JSX } from '@builder.io/qwik/jsx-runtime';
import type { Maybe, ResponseData } from '@modular-forms/shared';
import { getValues, setError, validate } from '../methods';
import type {
  FormStore,
  FieldValues,
  FieldPath,
  FieldArrayPath,
  SubmitHandler,
  FormActionStore,
  PartialValues,
} from '../types';
import { setErrorResponse } from '../utils';

export type FormProps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  // Custom props
  of: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>;
  action?: Maybe<
    ActionStore<
      FormActionStore<TFieldValues, TResponseData>,
      PartialValues<TFieldValues>,
      true
    >
  >;
  onSubmit$?: Maybe<SubmitHandler<TFieldValues>>;
  keepResponse?: Maybe<boolean>;
  shouldActive?: Maybe<boolean>;
  shouldTouched?: Maybe<boolean>;
  shouldDirty?: Maybe<boolean>;
  shouldFocus?: Maybe<boolean>;
  reloadDocument?: Maybe<boolean>;

  // HTML props
  id?: Maybe<string>;
  class?: Maybe<string>;
  autoComplete?: Maybe<'on' | 'off'>;
  encType?: Maybe<'application/x-www-form-urlencoded' | 'multipart/form-data'>;
  name?: Maybe<string>;
  children: any;
};

/**
 * Form element that takes care of validation and simplifies submission.
 */
export function Form<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
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
  reloadDocument,
  children,
  ...formProps
}: FormProps<
  TFieldValues,
  TResponseData,
  TFieldName,
  TFieldArrayName
>): JSX.Element {
  // Destructure form props
  const { encType } = formProps;

  // Create options object
  const options = { shouldActive, shouldTouched, shouldDirty, shouldFocus };

  return (
    <form
      {...formProps}
      method="post"
      action={action?.actionPath}
      preventdefault:submit={!reloadDocument}
      noValidate
      ref={(element: Element) => {
        form.element = element as HTMLFormElement;
      }}
      onSubmit$={async (event: QwikSubmitEvent<HTMLFormElement>, element) => {
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
              !reloadDocument
                ? action?.submit(encType ? new FormData(element) : values)
                : undefined,
              // TODO: Remove comment below once we have a better solution for
              // our `SubmitHandler` type
              // eslint-disable-next-line qwik/valid-lexical-scope
              onSubmit$?.(values as TFieldValues, event),
            ]);

            // Set form action result if necessary
            if (actionResult?.value) {
              const { errors, response } = actionResult.value;
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
              setErrorResponse(form, errors, options);
              if (Object.keys(response).length) {
                form.response = response;
              }
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
    >
      {children}
    </form>
  );
}
