import { FormResponse } from '@modular-forms/shared';
import { FieldValues, FormState } from '../types';

type ResponseOptions = Partial<{
  duration: number;
}>;

/**
 * Sets the response of the form.
 *
 * @param form The form to which the response belongs.
 * @param response The response object.
 * @param options The response options.
 */
export function setResponse<TFieldValues extends FieldValues>(
  form: FormState<TFieldValues>,
  response: FormResponse,
  options: ResponseOptions = {}
): void {
  // Destructure options
  const { duration } = options;

  // Set new response
  form.internal.setResponse(response);

  // If necessary, remove new response after specified duration if response has
  // not been changed in meantime
  if (typeof duration === 'number') {
    setTimeout(() => {
      if (form.response === response) {
        form.internal.setResponse({});
      }
    }, duration);
  }
}
