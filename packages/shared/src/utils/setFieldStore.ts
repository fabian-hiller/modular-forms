import type {
  FieldArrayPath,
  FieldPath,
  FieldStore,
  FieldValues,
  FormStore,
  RawFieldState,
  ResponseData,
} from '../types';

/**
 * Sets the store of a field to the specified state.
 *
 * @param initialize The initialize function.
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
  initialize: (
    form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
    name: TFieldName
  ) => FieldStore<TFieldValues, TFieldName>,
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName,
  state: RawFieldState<TFieldValues, TFieldName>
): void {
  const field = initialize(form, name);
  field.internal.startValue = state.startValue;
  field.value = state.value;
  field.error = state.error;
  field.touched = state.touched;
  field.dirty = state.dirty;
}
