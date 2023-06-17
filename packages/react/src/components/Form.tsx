import { batch } from '@preact/signals-react';
import type { FormEvent, FormHTMLAttributes, ReactNode } from 'react';
import { FormError } from '../exceptions';
import { getValues, setError, setResponse, validate } from '../methods';
import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  Maybe,
  MaybePromise,
  ResponseData,
} from '../types';

/**
 * Value type of the submit event object.
 */
export type SubmitEvent = Event & {
  submitter: HTMLElement;
} & {
  currentTarget: HTMLFormElement;
  target: Element;
};

/**
 * Function type to handle the submission of the form.
 */
export type SubmitHandler<TFieldValues extends FieldValues> = (
  values: TFieldValues,
  event: FormEvent<HTMLFormElement>
) => MaybePromise<any>;

/**
 * Value type of the form properties.
 */
export type FormProps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
> = Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  of: FormStore<TFieldValues, TResponseData>;
  onSubmit: SubmitHandler<TFieldValues>;
  responseDuration?: Maybe<number>;
  keepResponse?: Maybe<boolean>;
  shouldActive?: Maybe<boolean>;
  shouldTouched?: Maybe<boolean>;
  shouldDirty?: Maybe<boolean>;
  shouldFocus?: Maybe<boolean>;
  children: ReactNode;
};

/**
 * HTML form element that simplifies form submission and disables the browser's
 * default form validation.
 */
export function Form<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>({
  of: form,
  onSubmit,
  responseDuration: duration,
  keepResponse,
  shouldActive,
  shouldTouched,
  shouldDirty,
  shouldFocus,
  ...props
}: FormProps<TFieldValues, TResponseData>): JSX.Element {
  return (
    <form
      noValidate
      {...props}
      ref={(element) => (form.element.value = element)}
      onSubmit={async (event) => {
        // Prevent default behavior of browser
        event.preventDefault();

        batch(() => {
          // Reset response if it is not to be kept
          if (!keepResponse) {
            form.response.value = {};
          }

          // Increase submit count and set submitted and submitting to "true"
          form.submitCount.value++;
          form.submitted.value = true;
          form.submitting.value = true;
        });

        // Create options object
        const options = {
          duration,
          shouldActive,
          shouldTouched,
          shouldDirty,
          shouldFocus,
        };

        // Try to run submit actions if form is valid
        try {
          if (await validate(form, options)) {
            await onSubmit(getValues(form, options) as TFieldValues, event);
          }

          // If an error occurred, set error to fields and response
        } catch (error: any) {
          batch(() => {
            if (error instanceof FormError) {
              (
                Object.entries(error.errors) as [
                  FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>,
                  Maybe<string>
                ][]
              ).forEach(([name, error]) => {
                if (error) {
                  setError(form, name, error, {
                    ...options,
                    shouldFocus: false,
                  });
                }
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
          });

          // Finally set submitting back to "false"
        } finally {
          form.submitting.value = false;
        }
      }}
    />
  );
}
