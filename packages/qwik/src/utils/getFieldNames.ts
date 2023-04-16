import type { FieldPath, FieldValues, FormStore, ResponseData } from '../types';

/**
 * Returns a list with the names of all files.
 *
 * @param form The form of the fields.
 *
 * @returns All field names of the form.
 */
export function getFieldNames<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(form: FormStore<TFieldValues, TResponseData>): FieldPath<TFieldValues>[] {
  return Object.keys(form.internal.fields) as FieldPath<TFieldValues>[];
}
