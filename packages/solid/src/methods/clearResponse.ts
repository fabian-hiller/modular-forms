import type { FieldValues, FormStore, ResponseData } from '../types';

/**
 * Clears the response of the form.
 *
 * @param form The form of the response.
 */
export function clearResponse<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(form: FormStore<TFieldValues, TResponseData>): void {
  form.internal.setResponse({});
}
