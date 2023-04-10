import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  RawFieldState,
  ResponseData,
} from '@modular-forms/shared';
import type { FieldValue, FormStore } from '../types';
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
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName
): RawFieldState<TFieldValues, TFieldName, FieldValue> {
  const {
    internal: { startValue },
    value,
    error,
    touched,
    dirty,
  } = getFieldStore(form, name);
  return {
    startValue,
    value,
    error,
    touched,
    dirty,
  };
}
