import { batch, untrack } from 'solid-js';
import { FieldPath, FieldStore, FieldValues, FormState } from '../types';
import { updateDirty } from './updateDirty';

/**
 * Updates the dirty state of a field.
 *
 * @param form The form that contains the field.
 * @param field The field to be updated.
 */
export function updateFieldDirty<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  field: FieldStore<TFieldValues, TFieldName>
): void {
  // Ignores tracking of reactive dependencies
  untrack(() => {
    // Get initial input and input of field
    const initialInput = field.getInitialInput();
    const input = field.getInput();

    // Check if field is dirty
    const dirty =
      Array.isArray(initialInput) && Array.isArray(input)
        ? initialInput.join() !== input.join()
        : typeof initialInput === 'number' &&
          typeof input === 'number' &&
          isNaN(initialInput) &&
          isNaN(input)
        ? false
        : initialInput !== input;

    // Sync state updates and prevent unnecessary recalculation
    batch(() => {
      // Update dirty state of field
      field.setDirty(dirty);

      // Update dirty state of form
      updateDirty(form, dirty);
    });
  });
}
