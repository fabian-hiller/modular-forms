import type {
  FieldArrayPath,
  FieldArrayStore,
  FieldPath,
  FieldStore,
  FieldValues,
  FormStore,
  ResponseData,
} from '../types';

/**
 * Returns a tuple with all field and field array stores of a form.
 *
 * @param form The form of the stores.
 *
 * @returns The store tuple.
 */
export function getFieldAndArrayStores<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>
): (
  | FieldStore<TFieldValues, FieldPath<TFieldValues>>
  | FieldArrayStore<TFieldValues, FieldArrayPath<TFieldValues>>
)[] {
  return [
    ...Object.values(form.internal.fields),
    ...Object.values(form.internal.fieldArrays),
  ] as (
    | FieldStore<TFieldValues, FieldPath<TFieldValues>>
    | FieldArrayStore<TFieldValues, FieldArrayPath<TFieldValues>>
  )[];
}
