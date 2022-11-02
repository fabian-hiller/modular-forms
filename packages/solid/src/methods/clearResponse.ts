import { FieldValues, FormState } from '../types';

/**
 * Clears the response of the form.
 *
 * @param form The form with the response to be cleared.
 */
export function clearResponse<TFieldValues extends FieldValues>(
  form: FormState<TFieldValues>
): void {
  form.internal.setResponse({});
}
