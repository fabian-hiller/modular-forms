import { FieldArrayStore, RawFieldArrayState } from '../types';

/**
 * Sets the state of the field array.
 *
 * @param fieldArray The name of the field array to set the state to.
 * @param state The state to be set.
 */
export function setFieldArrayState(
  fieldArray: FieldArrayStore,
  state: RawFieldArrayState
): void {
  fieldArray.setInitialItems(state.initialItems);
  fieldArray.setItems(state.items);
  fieldArray.setError(state.error);
  fieldArray.setTouched(state.touched);
  fieldArray.setDirty(state.dirty);
}
