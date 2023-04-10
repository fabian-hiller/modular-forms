import { RawFieldArrayState } from '@modular-forms/shared';
import { untrack } from 'solid-js';
import { FieldArrayStore } from '../types';

/**
 * Returns the state of the field array.
 *
 * @param field The field array to get the state from.
 *
 * @returns The state of the field array.
 */
export function getFieldArrayState(
  fieldArray: FieldArrayStore
): RawFieldArrayState {
  return untrack(() => ({
    initialItems: fieldArray.getInitialItems(),
    items: fieldArray.getItems(),
    error: fieldArray.getError(),
    touched: fieldArray.getTouched(),
    dirty: fieldArray.getDirty(),
  }));
}
