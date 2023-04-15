import type {
  FieldArrayPath,
  FieldArrayStore,
  FieldValues,
  FormStore,
  RawFieldArrayState,
  ResponseData,
} from '../types';

/**
 * Sets the store of a field array to the specified state.
 *
 * @param initialize The initialize function.
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param state The new state to be set.
 */
export function setFieldArrayStore<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  initialize: (
    form: FormStore<TFieldValues, TResponseData>,
    name: TFieldArrayName
  ) => FieldArrayStore<TFieldValues, TFieldArrayName>,
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldArrayName,
  state: RawFieldArrayState
): void {
  const fieldArray = initialize(form, name);
  fieldArray.internal.startItems = state.startItems;
  fieldArray.items = state.items;
  fieldArray.error = state.error;
  fieldArray.touched = state.touched;
  fieldArray.dirty = state.dirty;
}
