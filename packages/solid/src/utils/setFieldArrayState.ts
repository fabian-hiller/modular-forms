import type {
  FieldArrayPath,
  FieldValues,
  FormStore,
  RawFieldArrayState,
  ResponseData,
} from '../types';
import { initializeFieldArrayStore } from './initializeFieldArrayStore';

/**
 * Sets the store of a field array to the specified state.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param state The new state to be set.
 */
export function setFieldArrayState<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldArrayName,
  state: RawFieldArrayState
): void {
  const fieldArray = initializeFieldArrayStore(form, name);
  fieldArray.setStartItems(state.startItems);
  fieldArray.setItems(state.items);
  fieldArray.setError(state.error);
  fieldArray.setTouched(state.touched);
  fieldArray.setDirty(state.dirty);
}
