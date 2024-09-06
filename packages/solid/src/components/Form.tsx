import { batch, type JSX, splitProps } from 'solid-js';
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
 * Function type to handle the submission of the form.
 */
export type SubmitHandler<TFieldValues extends FieldValues> = (
  values: TFieldValues,
  event: SubmitEvent
) => MaybePromise<any>;

/**
 * Value type of the form properties.
 */
export type FormProps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
> = Omit<JSX.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  of: FormStore<TFieldValues, TResponseData>;
  onSubmit?: Maybe<SubmitHandler<TFieldValues>>;
  responseDuration?: Maybe<number>;
  keepResponse?: Maybe<boolean>;
  shouldActive?: Maybe<boolean>;
  shouldTouched?: Maybe<boolean>;
  shouldDirty?: Maybe<boolean>;
  shouldFocus?: Maybe<boolean>;
  children: JSX.Element;
};

/**
 * HTML form element that simplifies form submission and disables the browser's
 * default form validation.
 */
export function Form<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
>(props: FormProps<TFieldValues, TResponseData>): JSX.Element {
  // Split props between local, options and other
  const [, options, other] = splitProps(
    props,
    ['of'],
    [
      'keepResponse',
      'shouldActive',
      'shouldTouched',
      'shouldDirty',
      'shouldFocus',
    ]
  );

  return (
    <form
      novalidate
      {...other}
      ref={props.of.internal.element.set}
      onSubmit={async (event) => {
        // Prevent default behavior of browser
        event.preventDefault();

        // Destructure props
        // eslint-disable-next-line solid/reactivity
        const { of: form, onSubmit, responseDuration: duration } = props;

        batch(() => {
          // Reset response if it is not to be kept
          if (!options.keepResponse) {
            form.internal.response.set({});
          }

          // Increase submit count and set submitted and submitting to "true"
          form.internal.submitCount.set((count) => count + 1);
          form.internal.submitted.set(true);
          form.internal.submitting.set(true);
        });

        // Try to run submit actions if form is valid
        try {
          if (await validate(form, options)) {
            await onSubmit?.(getValues(form, options) as TFieldValues, event);
          }

          // If an error occurred, set error to fields and response
        } catch (error: any) {
          batch(() => {
            if (error instanceof FormError) {
              (
                Object.entries(error.errors) as [
                  FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>,
                  Maybe<string>,
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
                { duration }
              );
            }
          });

          // Finally set submitting back to "false"
        } finally {
          form.internal.submitting.set(false);
        }
      }}
    />
  );
}
