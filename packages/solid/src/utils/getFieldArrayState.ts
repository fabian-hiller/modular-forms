import { untrack } from 'solid-js';
import { FieldArrayStore, RawFieldArrayState } from '../types';

/**
 * Returns the state of the field array.
 *
 * @param field The field array to get the state from.
 *
 * @returns The state of the field array.
 */
export function getFieldArrayState(field: FieldArrayStore): RawFieldArrayState {
  return untrack(() => ({
    initialItems: field.getInitialItems(),
    items: field.getItems(),
    error: field.getError(),
    touched: field.getTouched(),
    dirty: field.getDirty(),
  }));
}
