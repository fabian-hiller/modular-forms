import { batch, untrack } from 'solid-js';
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
  untrack(() => {
    for (const fieldOrFieldArray of getFieldAndArrayStores(form)) {
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
