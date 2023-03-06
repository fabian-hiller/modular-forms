import type {
  FieldArrayPath,
  FieldArrayStore,
  FieldPath,
  FieldValues,
  FormStore,
} from '../types';
import { updateFormDirty } from './updateFormDirty';

/**
 * Updates the dirty state of a field array.
 *
 * @param form The form of the field array.
 * @param fieldArray The store of the field array.
 */
export function updateFieldArrayDirty<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TFieldName, TFieldArrayName>,
  fieldArray: FieldArrayStore<TFieldValues, TFieldArrayName>
): void {
  // Check if field array is dirty
  const dirty =
    fieldArray.internal.startItems.join() !== fieldArray.items.join();

  // Update dirty state of field array if necessary
  if (dirty !== fieldArray.dirty) {
    fieldArray.dirty = dirty;

    // Update dirty state of form
    updateFormDirty(form, dirty);
  }
}
