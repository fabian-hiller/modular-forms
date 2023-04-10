import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  ResponseData,
} from '@modular-forms/shared';
import type {
  FormStore,
  FieldStore,
  FieldArrayStore,
  FieldValue,
} from '../types';

/**
 * Returns a tuple with all field and field array stores of a form.
 *
 * @param form The form of the stores.
 *
 * @returns The store tuple.
 */
export function getFieldAndArrayStores<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
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
