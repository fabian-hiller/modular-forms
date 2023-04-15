import type { FieldPath, FieldValues, FormStore, ResponseData } from '../types';
import { getFieldStore } from '../utils';

/**
 * Focuses the specified field of the form.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 */
export function focus<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: FieldPath<TFieldValues>
): void {
  getFieldStore(form, name)?.internal.elements[0]?.focus();
}
