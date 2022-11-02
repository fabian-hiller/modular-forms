import { batch, untrack } from 'solid-js';
import { FieldArrayPath, FieldPath, FieldValues, FormState } from '../types';
import { getField, getFieldArray } from '../utils';
import { focus } from './focus';

type ErrorOptions = Partial<{
  shouldFocus: boolean;
}>;

/**
 * Sets the error of the specified field or field array.
 *
 * @param form The form that contains the field.
 * @param name The name of the field where the error should be set.
 * @param error The error message.
 * @param options The error options.
 */
export function setError<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  name: TFieldName | TFieldArrayName,
  error: string,
  options: ErrorOptions = {}
): void {
  // Destructure options and set default values
  const { shouldFocus = !!error } = options;

  // Check if it is name of field array
  const isFieldArray = form.internal.fieldArrays.has(name);

  // Get specified field or field array
  const fieldOrFieldArray = isFieldArray
    ? getFieldArray(form, name as TFieldArrayName)
    : getField(form, name as TFieldName);

  // Sync state updates and prevent unnecessary recalculation
  batch(() => {
    // Ignores tracking of reactive dependencies
    untrack(() => {
      // Set error
      fieldOrFieldArray.setError(error);

      // Update invalid state of form
      form.internal.setInvalid(
        !!error ||
          [...form.internal.fields, ...form.internal.fieldArrays].some(
            ([, fieldOrFieldArray]) =>
              fieldOrFieldArray.getActive() && fieldOrFieldArray.getError()
          )
      );
    });

    // Focus element if set to "true"
    if (error && !isFieldArray && shouldFocus) {
      focus(form, name as TFieldName);
    }
  });
}
