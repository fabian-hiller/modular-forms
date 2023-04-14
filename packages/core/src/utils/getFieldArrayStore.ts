import type {
  FieldArrayPath,
  FieldArrayStore,
  FieldPath,
  FieldValues,
  FormStore,
  Maybe,
  ResponseData,
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
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldArrayName
): Maybe<FieldArrayStore<TFieldValues, TFieldArrayName>> {
  return form.internal.fieldArrays[name];
}
