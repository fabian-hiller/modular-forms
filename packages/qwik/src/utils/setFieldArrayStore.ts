import type {
  FieldValues,
  FieldPath,
  FormStore,
  FieldArrayPath,
  RawFieldArrayState,
} from '../types';

/**
 * Sets the store of a field array to the specified state.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param state The new state to be set.
 */
export function setFieldArrayStore<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TFieldName, TFieldArrayName>,
  name: TFieldArrayName,
  state: RawFieldArrayState
): void {
  const { startItems, ...rest } = state;
  form.internal.fieldArrays[name] = {
    ...rest,
    name,
    internal: {
      ...(form.internal.fieldArrays[name]?.internal || {
        initialItems: startItems,
        validate: [],
        elements: [],
        consumers: [],
      }),
      startItems,
    },
  };
}
