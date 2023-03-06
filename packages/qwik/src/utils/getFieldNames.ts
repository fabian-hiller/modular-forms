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
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(form: FormStore<TFieldValues, TFieldName, TFieldArrayName>): TFieldName[] {
  return Object.keys(form.internal.fields) as TFieldName[];
}
