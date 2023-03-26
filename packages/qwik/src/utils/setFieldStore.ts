import type {
  FieldValues,
  FieldPath,
  FormStore,
  FieldArrayPath,
  RawFieldState,
  ResponseData,
} from '../types';

/**
 * Sets the store of a field to the specified state.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 * @param state The new state to be set.
 */
export function setFieldStore<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName,
  state: RawFieldState<TFieldValues, TFieldName>
): void {
  const { startValue, ...rest } = state;
  form.internal.fields[name] = {
    ...rest,
    name,
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
