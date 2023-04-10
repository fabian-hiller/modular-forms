import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  ResponseData,
} from '@modular-forms/shared';
import type { FormStore, RawFieldState, FieldValue } from '../types';

/**
 * Sets the store of a field to the specified state.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 * @param state The new state to be set.
 */
export function setFieldStore<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName,
  state: RawFieldState<TFieldValues, TFieldName>
): void {
  const { startValue, ...rest } = state;
  form.internal.fields[name] = {
    ...(form.internal.fields[name] || { name, active: false }),
    ...rest,
    internal: {
      ...(form.internal.fields[name]?.internal || {
        initialValue: startValue,
        validate: [],
        elements: [],
        consumers: [],
      }),
      startValue,
    },
  };
}
