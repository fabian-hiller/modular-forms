import type {
  FieldPath,
  FieldValues,
  FormStore,
  InternalFieldArrayStore,
  InternalFieldStore,
  ResponseData,
} from '../types/index.js';

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
  | InternalFieldStore<TFieldValues, FieldPath<TFieldValues>>
  | InternalFieldArrayStore
)[] {
  return [
    ...Object.values(form.internal.fields),
    ...Object.values(form.internal.fieldArrays),
  ] as (
    | InternalFieldStore<TFieldValues, FieldPath<TFieldValues>>
    | InternalFieldArrayStore
  )[];
}
