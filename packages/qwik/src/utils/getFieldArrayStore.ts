import type {
  FieldArrayPath,
  FieldArrayStore,
  FieldPath,
  FieldValues,
  FormStore,
} from '../types';

/**
 * Returns the store of a field array.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 *
 * @returns The reactive store.
 */
export function getFieldArrayStore<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TFieldName, TFieldArrayName>,
  name: TFieldArrayName
): FieldArrayStore<TFieldValues, TFieldArrayName> {
  return form.internal.fieldArrays[name];
}
