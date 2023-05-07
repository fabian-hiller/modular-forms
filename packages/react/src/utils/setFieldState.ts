import type {
  FieldPath,
  FieldValues,
  FormStore,
  RawFieldState,
  ResponseData,
} from '../types';
import { initializeFieldStore } from './initializeFieldStore';

/**
 * Sets the store of a field to the specified state.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 * @param state The new state to be set.
 */
export function setFieldState<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldName,
  state: RawFieldState<TFieldValues, TFieldName>
): void {
  const field = initializeFieldStore(form, name);
  field.startValue.value = state.startValue;
  field.value.value = state.value;
  field.error.value = state.error;
  field.touched.value = state.touched;
  field.dirty.value = state.dirty;
}
