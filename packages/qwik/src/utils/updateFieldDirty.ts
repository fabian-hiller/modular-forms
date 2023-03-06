import type {
  FieldArrayPath,
  FieldPath,
  FieldStore,
  FieldValues,
  FormStore,
} from '../types';
import { updateFormDirty } from './updateFormDirty';

/**
 * Updates the dirty state of a field.
 *
 * @param form The form of the field.
 * @param field The store of the field.
 */
export function updateFieldDirty<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TFieldName, TFieldArrayName>,
  field: FieldStore<TFieldValues, TFieldName>
): void {
  // Get start value and value of field
  const startValue = field.internal.startValue;
  const value = field.value;

  // Check if field is dirty
  const dirty =
    Array.isArray(startValue) && Array.isArray(value)
      ? startValue.join() !== value.join()
      : typeof startValue === 'number' &&
        typeof value === 'number' &&
        isNaN(startValue) &&
        isNaN(value)
      ? false
      : startValue !== value;

  // Update dirty state of field if necessary
  if (dirty !== field.dirty) {
    field.dirty = dirty;

    // Update dirty state of form
    updateFormDirty(form, dirty);
  }
}
