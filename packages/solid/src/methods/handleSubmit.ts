import { batch } from 'solid-js';
import { FieldValues, FormState } from '../types';
import { getValues } from './getValues';
import { validate } from './validate';

type SubmitOptions = Partial<{
  keepResponse: boolean;
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldFocus: boolean;
}>;

/**
 * Handles the submission of the form.
 *
 * @param form The form to be submitted.
 * @param submitAction The user-specific submit action.
 *
 * @returns A submit event handler.
 */
export function handleSubmit<TFieldValues extends FieldValues>(
  form: FormState<TFieldValues>,
  submitAction: (values: TFieldValues, event: Event) => void | Promise<void>,
  options: SubmitOptions = {}
): (event: Event) => Promise<void> {
  return async (event: Event) => {
    // Prevent default behavior of browser
    event.preventDefault();

    // Destructure options and set default values
    const {
      keepResponse = false,
      shouldActive = true,
      shouldTouched = false,
      shouldDirty = false,
      shouldFocus = true,
    } = options;

    batch(() => {
      // Reset response if it is not to be kept
      if (!keepResponse) {
        form.internal.setResponse({});
      }

      // Increase submit count and set submitted and submitting to "true"
      form.internal.setSubmitCount((submitCount) => submitCount + 1);
      form.internal.setSubmitted(true);
      form.internal.setSubmitting(true);
    });

    // Try to run submit action if form is valid
    try {
      if (await validate(form, { shouldActive, shouldFocus })) {
        await submitAction(
          getValues(form, {
            shouldActive,
            shouldTouched,
            shouldDirty,
          }) as TFieldValues,
          event
        );
      }

      // If an error occurred, set error response
    } catch (error: any) {
      form.internal.setResponse({
        status: 'error',
        message: error?.message || 'An unknown error has occurred.',
      });

      // Finally set submitting back to "false"
    } finally {
      form.internal.setSubmitting(false);
    }
  };
}
