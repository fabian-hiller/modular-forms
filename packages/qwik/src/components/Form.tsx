import type { QwikSubmitEvent } from '@builder.io/qwik';
import type { ActionStore } from '@builder.io/qwik-city';
import type { JSX } from '@builder.io/qwik/jsx-runtime';
import { FormError } from '../exceptions';
import { getValues, setResponse, validate } from '../methods';
import type {
  FieldValues,
  FormActionStore,
  FormStore,
  Maybe,
  MaybePromise,
  MaybeQRL,
  PartialValues,
  ResponseData,
} from '../types';
import { setErrorResponse, setFieldErrors } from '../utils';

/**
 * Function type to handle the submission of the form.
 */
export type SubmitHandler<TFieldValues extends FieldValues> = MaybeQRL<
  (
    values: TFieldValues,
    event: QwikSubmitEvent<HTMLFormElement>
  ) => MaybePromise<any>
>;

/**
 * Value type of the form properties.
 */
export type FormProps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
> = {
  // Custom props
  of: FormStore<TFieldValues, TResponseData>;
  action?: Maybe<
    ActionStore<
      FormActionStore<TFieldValues, TResponseData>,
      PartialValues<TFieldValues>,
      true
    >
  >;
  onSubmit$?: Maybe<SubmitHandler<TFieldValues>>;
  responseDuration?: Maybe<number>;
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
  TResponseData extends ResponseData
>({
  of: form,
  action,
  onSubmit$,
  responseDuration: duration,
  keepResponse,
  shouldActive,
  shouldTouched,
  shouldDirty,
  shouldFocus,
  reloadDocument,
  children,
  ...formProps
}: FormProps<TFieldValues, TResponseData>): JSX.Element {
  // Destructure form props
  const { encType } = formProps;

  // Create options object
  const options = {
    duration,
    shouldActive,
    shouldTouched,
    shouldDirty,
    shouldFocus,
  };

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
              // eslint-disable-next-line qwik/valid-lexical-scope
              onSubmit$?.(values as TFieldValues, event),
            ]);

            // Set form action result if necessary
            if (actionResult?.value) {
              const { errors, response } = actionResult.value;
              setFieldErrors(form, errors, { ...options, shouldFocus: false });
              if (Object.keys(response).length) {
                setResponse(form, response, options);
              } else {
                setErrorResponse(form, errors, options);
              }
            }
          }

          // If an error occurred, set error to fields and response
        } catch (error: any) {
          if (error instanceof FormError) {
            setFieldErrors(form, error.errors, {
              ...options,
              shouldFocus: false,
            });
          }
          if (!(error instanceof FormError) || error.message) {
            setResponse(
              form,
              {
                status: 'error',
                message: error?.message || 'An unknown error has occurred.',
              },
              options
            );
          }

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
