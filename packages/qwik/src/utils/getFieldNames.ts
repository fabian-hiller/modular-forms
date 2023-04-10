import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  ResponseData,
} from '@modular-forms/shared';
import type { FormStore, FieldValue } from '../types';

/**
 * Returns a list with the names of all files.
 *
 * @param form The form of the fields.
 *
 * @returns All field names of the form.
 */
export function getFieldNames<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>
): TFieldName[] {
  return Object.keys(form.internal.fields) as TFieldName[];
}
