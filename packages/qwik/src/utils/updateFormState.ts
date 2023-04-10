import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  ResponseData,
} from '@modular-forms/shared';
import type { FieldValue, FormStore } from '../types';
import { getFieldAndArrayStores } from './getFieldAndArrayStores';

/**
 * Updates the touched, dirty and invalid state of the form.
 *
 * @param form The store of the form.
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

  // Update state of form
  form.touched = touched;
  form.dirty = dirty;
  form.invalid = invalid;
}
