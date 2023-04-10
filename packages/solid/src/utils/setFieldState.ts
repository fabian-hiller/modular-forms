import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  Maybe,
  RawFieldState,
} from '@modular-forms/shared';
import { FieldStore, FieldValue } from '../types';

/**
 * Sets the state of the field.
 *
 * @param field The name of the field to set the state to.
 * @param state The state to be set.
 */
export function setFieldState<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues, FieldValue>
>(field: FieldStore<TFieldValues, TFieldName>, state: RawFieldState): void {
  field.setElements(state.elements);
  field.setInitialInput(
    () =>
      state.initialInput as Maybe<
        FieldPathValue<TFieldValues, TFieldName, FieldValue>
      >
  );
  field.setInput(
    () =>
      state.input as Maybe<FieldPathValue<TFieldValues, TFieldName, FieldValue>>
  );
  field.setError(state.error);
  field.setTouched(state.touched);
  field.setDirty(state.dirty);
}
