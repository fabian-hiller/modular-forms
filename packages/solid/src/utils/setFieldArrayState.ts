import type {
  FieldArrayPath,
  FieldValues,
  FormStore,
  RawFieldArrayState,
  ResponseData,
} from '../types/index.js';
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
  fieldArray.startItems.set(state.startItems);
  fieldArray.items.set(state.items);
  fieldArray.error.set(state.error);
  fieldArray.touched.set(state.touched);
  fieldArray.dirty.set(state.dirty);
}
