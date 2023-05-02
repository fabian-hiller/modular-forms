import { batch } from '@preact/signals';
import type { FieldValues, FormStore, ResponseData } from '../types';
import { getFieldAndArrayStores } from './getFieldAndArrayStores';

/**
 * Updates the touched, dirty and invalid state of the form.
 *
 * @param form The store of the form.
 */
export function updateFormState<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(form: FormStore<TFieldValues, TResponseData>): void {
  // Create state variables
  let touched = false,
    dirty = false,
    invalid = false;

  // Check each field and field array and update state if necessary
  for (const fieldOrFieldArray of getFieldAndArrayStores(form)) {
    if (fieldOrFieldArray.active.peek()) {
      if (fieldOrFieldArray.touched.peek()) {
        touched = true;
      }
      if (fieldOrFieldArray.dirty.peek()) {
        dirty = true;
      }
      if (fieldOrFieldArray.error.peek()) {
        invalid = true;
      }
    }

    // Break loop if all state values are "true"
    if (touched && dirty && invalid) {
      break;
    }
  }

  // Update state of form
  batch(() => {
    form.touched.value = touched;
    form.dirty.value = dirty;
    form.invalid.value = invalid;
  });
}
