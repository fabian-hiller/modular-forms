import type {
  FieldArrayPath,
  FieldValues,
  FormStore,
  InternalFieldArrayStore,
  Maybe,
  ResponseData,
} from '../types/index.js';

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
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldArrayName
): Maybe<InternalFieldArrayStore> {
  return form.internal.fieldArrays[name];
}
