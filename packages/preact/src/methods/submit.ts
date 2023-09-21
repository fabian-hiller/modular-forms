import type { FieldValues, FormStore, ResponseData } from '../types';

/**
 * Validates and submits the form.
 *
 * @param form The form to be validated and submitted.
 */
export function submit<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(form: FormStore<TFieldValues, TResponseData>): void {
  form.element.value?.requestSubmit();
}
