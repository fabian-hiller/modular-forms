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
  fieldArray.internal.startItems = state.startItems;
  fieldArray.items = state.items;
  fieldArray.error = state.error;
  fieldArray.touched = state.touched;
  fieldArray.dirty = state.dirty;
}
