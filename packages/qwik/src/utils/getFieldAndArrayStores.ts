import type { ResponseData } from '@modular-forms/shared';
import type {
  FieldValues,
  FieldPath,
  FieldArrayPath,
  FormStore,
  FieldStore,
  FieldArrayStore,
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
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>
): (
  | FieldStore<TFieldValues, TFieldName>
  | FieldArrayStore<TFieldValues, TFieldArrayName>
)[] {
  return [
    ...Object.values(form.internal.fields),
    ...Object.values(form.internal.fieldArrays),
  ] as (
    | FieldStore<TFieldValues, TFieldName>
    | FieldArrayStore<TFieldValues, TFieldArrayName>
  )[];
}
