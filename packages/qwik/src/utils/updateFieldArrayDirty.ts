import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  ResponseData,
} from '@modular-forms/shared';
import type { FieldArrayStore, FieldValue, FormStore } from '../types';
import { updateFormDirty } from './updateFormDirty';

/**
 * Updates the dirty state of a field array.
 *
 * @param form The form of the field array.
 * @param fieldArray The store of the field array.
 */
export function updateFieldArrayDirty<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
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
