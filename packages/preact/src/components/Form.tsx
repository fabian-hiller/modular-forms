import { batch } from '@preact/signals';
import type { ComponentChildren } from 'preact';
import type { JSX } from 'preact/jsx-runtime';
import { getValues, validate } from '../methods';
import type {
  FieldValues,
  FormStore,
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
  event: JSX.TargetedEvent<HTMLFormElement, Event>
) => MaybePromise<any>;

/**
 * Value type of the form properties.
 */
export type FormProps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
> = Omit<JSX.HTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  of: FormStore<TFieldValues, TResponseData>;
  onSubmit: SubmitHandler<TFieldValues>;
  keepResponse?: boolean;
  shouldActive?: boolean;
  shouldTouched?: boolean;
  shouldDirty?: boolean;
  shouldFocus?: boolean;
  children: ComponentChildren;
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
  keepResponse,
  shouldActive,
  shouldTouched,
  shouldDirty,
  shouldFocus,
  ...props
}: FormProps<TFieldValues, TResponseData>): JSX.Element {
  return (
    <form
      {...props}
      noValidate
      ref={(element) => (form.element.value = element)}
      onSubmit={async (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
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

          // If an error occurred, set error response
        } catch (error: any) {
          form.response.value = {
            status: 'error',
            message: error?.message || 'An unknown error has occurred.',
          };

          // Finally set submitting back to "false"
        } finally {
          form.submitting.value = false;
        }
      }}
    />
  );
}
