import type { FieldValues, FormStore, ResponseData } from '../types/index.js';

/**
 * Clears the response of the form.
 *
 * @param form The form of the response.
 */
export function clearResponse<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(form: FormStore<TFieldValues, TResponseData>): void {
  form.internal.response.set({});
}
