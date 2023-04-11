import {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  ResponseData,
} from '@modular-forms/shared';
import { JSX, batch, splitProps } from 'solid-js';
import { FieldValue, FormStore, SubmitEvent, SubmitHandler } from '../types';
import { getValues, validate } from '../methods';

export type FormProps<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
> = Omit<JSX.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  of: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>;
  onSubmit: SubmitHandler<TFieldValues>;
  keepResponse?: boolean;
  shouldActive?: boolean;
  shouldTouched?: boolean;
  shouldDirty?: boolean;
  shouldFocus?: boolean;
  children: JSX.Element;
};

/**
 * HTML form element that simplifies form submission and disables the browser's
 * default form validation.
 */
export function Form<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  props: FormProps<TFieldValues, TResponseData, TFieldName, TFieldArrayName>
): JSX.Element {
  // Split props between local, options and other
  const [local, options, other] = splitProps(
    props,
    ['of', 'onSubmit'],
    [
      'keepResponse',
      'shouldActive',
      'shouldTouched',
      'shouldDirty',
      'shouldFocus',
    ]
  );

  // Return HTML form element and include handleSubmit in onSubmit
  return (
    <form
      {...other}
      ref={props.of.internal.setElement}
      onSubmit={async (event: SubmitEvent) => {
        // Prevent default behavior of browser
        event.preventDefault();

        batch(() => {
          // Reset response if it is not to be kept
          if (!options.keepResponse) {
            local.of.internal.setResponse({});
          }

          // Increase submit count and set submitted and submitting to "true"
          local.of.internal.setSubmitCount((count) => count + 1);
          local.of.internal.setSubmitted(true);
          local.of.internal.setSubmitting(true);
        });

        // Try to run submit action if form is valid
        try {
          if (await validate(local.of, options)) {
            await local.onSubmit(getValues(local.of, options), event);
          }

          // If an error occurred, set error response
        } catch (error: any) {
          local.of.internal.setResponse({
            status: 'error',
            message: error?.message || 'An unknown error has occurred.',
          });

          // Finally set submitting back to "false"
        } finally {
          local.of.internal.setSubmitting(false);
        }
      }}
      noValidate
    />
  );
}
