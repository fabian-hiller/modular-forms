import { FieldPath, FieldValues, RawFieldState } from '@modular-forms/shared';
import { untrack } from 'solid-js';
import { FieldStore, FieldValue } from '../types';

/**
 * Returns the state of the field.
 *
 * @param field The field to get the state from.
 *
 * @returns The state of the field.
 */
export function getFieldState<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues, FieldValue>
>(field: FieldStore<TFieldValues, TFieldName>): RawFieldState {
  return untrack(() => ({
    elements: field.getElements(),
    initialInput: field.getInitialInput(),
    input: field.getInput(),
    error: field.getError(),
    touched: field.getTouched(),
    dirty: field.getDirty(),
  })) as RawFieldState;
}
