import type { ResponseData } from '@modular-forms/shared';
import type {
  FieldValues,
  FieldPath,
  FieldArrayPath,
  FormStore,
} from '../types';

/**
 * Returns a list with the names of all files.
 *
 * @param form The form of the fields.
 *
 * @returns All field names of the form.
 */
export function getFieldNames<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>
): TFieldName[] {
  return Object.keys(form.internal.fields) as TFieldName[];
}
