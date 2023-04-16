import type {
  FieldValues,
  ResponseData,
  FieldArrayPath,
  FormStore,
} from '../types';

/**
 * Returns a list with the names of all file arrays.
 *
 * @param form The form of the field arrays.
 *
 * @returns All field array names of the form.
 */
export function getFieldArrayNames<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>
): FieldArrayPath<TFieldValues>[] {
  return Object.keys(
    form.internal.fieldArrays
  ) as FieldArrayPath<TFieldValues>[];
}
