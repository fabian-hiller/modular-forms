import { FieldValues, Maybe } from '@modular-forms/shared';
import {
  FieldPath,
  FieldPathValue,
  FieldStore,
  FieldValue,
  RawFieldState,
} from '../types';

/**
 * Sets the state of the field.
 *
 * @param field The name of the field to set the state to.
 * @param state The state to be set.
 */
export function setFieldState<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues>
>(field: FieldStore<TFieldValues, TFieldName>, state: RawFieldState): void {
  field.setElements(state.elements);
  field.setInitialInput(
    () => state.initialInput as Maybe<FieldPathValue<TFieldValues, TFieldName>>
  );
  field.setInput(
    () => state.input as Maybe<FieldPathValue<TFieldValues, TFieldName>>
  );
  field.setError(state.error);
  field.setTouched(state.touched);
  field.setDirty(state.dirty);
}
