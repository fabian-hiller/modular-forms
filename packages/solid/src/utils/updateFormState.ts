import {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  ResponseData,
} from '@modular-forms/shared';
import { batch, untrack } from 'solid-js';
import { FieldValue, FormStore } from '../types';
import { getFieldAndArrayStores } from './getFieldAndArrayStores';

/**
 * Updates the touched, dirty and invalid state of the form.
 *
 * @param form The form to be updated.
 */
export function updateFormState<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>
): void {
  // Create state variables
  let touched = false,
    dirty = false,
    invalid = false;

  // Ignores tracking of reactive dependencies
  untrack(() => {
    // Check each field and field array and update state if necessary
    for (const fieldOrFieldArray of getFieldAndArrayStores(form)) {
      if (fieldOrFieldArray.active) {
        if (fieldOrFieldArray.touched) {
          touched = true;
        }
        if (fieldOrFieldArray.dirty) {
          dirty = true;
        }
        if (fieldOrFieldArray.error) {
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
