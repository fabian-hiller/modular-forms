import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  Maybe,
  RawFieldState,
  ResponseData,
} from '../types';
import { getFieldStore } from './getFieldStore';

/**
 * Returns the RAW state of the field.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 *
 * @returns The state of the field.
 */
export function getFieldState<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName
): Maybe<RawFieldState<TFieldValues, TFieldName>> {
  const field = getFieldStore(form, name);
  return field
    ? {
        startValue: field.internal.startValue,
        value: field.value,
        error: field.error,
        touched: field.touched,
        dirty: field.dirty,
      }
    : undefined;
}
