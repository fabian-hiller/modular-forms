import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  RawFieldState,
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
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TFieldName, TFieldArrayName>,
  name: TFieldName
): RawFieldState<TFieldValues, TFieldName> {
  const {
    internal: { startValue },
    value,
    error,
    active,
    touched,
    dirty,
  } = getFieldStore(form, name);
  return {
    startValue,
    value,
    error,
    active,
    touched,
    dirty,
  };
}
