import { batch, untrack } from 'solid-js';
import { FieldValues, FormState } from '../types';

/**
 * Updates the touched, dirty and invalid state of the form.
 *
 * @param form The form to be updated.
 */
export function updateState<TFieldValues extends FieldValues>(
  form: FormState<TFieldValues>
): void {
  // Create state variables
  let touched = false,
    dirty = false,
    invalid = false;

  // Ignores tracking of reactive dependencies
  untrack(() => {
    // Check each field and field array and update state if necessary
    for (const [, fieldOrFieldArray] of [
      ...form.internal.fields,
      ...form.internal.fieldArrays,
    ]) {
      if (fieldOrFieldArray.getActive()) {
        if (fieldOrFieldArray.getTouched()) {
          touched = true;
        }
        if (fieldOrFieldArray.getDirty()) {
          dirty = true;
        }
        if (fieldOrFieldArray.getError()) {
          invalid = true;
        }
      }

      // Break loop if all state values are "true"
      if (touched && dirty && invalid) {
        break;
      }
    }
  });

  // Update state of form
  batch(() => {
    form.internal.setTouched(touched);
    form.internal.setDirty(dirty);
    form.internal.setInvalid(invalid);
  });
}
