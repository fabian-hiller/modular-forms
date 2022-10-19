import { batch, untrack } from 'solid-js';
import { FieldArrayStore, FieldValues, FormState } from '../types';
import { updateDirty } from './updateDirty';

/**
 * Updates the dirty state of a field array.
 *
 * @param form The form that contains the field array.
 * @param fieldArray The field array to be updated.
 */
export function updateFieldArrayDirty<TFieldValues extends FieldValues>(
  form: FormState<TFieldValues>,
  fieldArray: FieldArrayStore
): void {
  // Ignores tracking of reactive dependencies
  untrack(() => {
    // Check if field array is dirty
    const dirty =
      fieldArray.getInitialItems().join() !== fieldArray.getItems().join();

    // Sync state updates and prevent unnecessary recalculation
    batch(() => {
      // Update dirty state of field array
      fieldArray.setDirty(dirty);

      // Update dirty state of form
      updateDirty(form, dirty);
    });
  });
}
