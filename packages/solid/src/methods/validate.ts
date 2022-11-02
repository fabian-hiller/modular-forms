import { batch, untrack } from 'solid-js';
import { FieldArrayPath, FieldPath, FieldValues, FormState } from '../types';
import {
  getField,
  getOptions,
  getUniqueId,
  getFilteredNames,
  getFieldArray,
} from '../utils';
import { focus } from './focus';

type ValidateOptions = Partial<{
  shouldActive: boolean;
  shouldFocus: boolean;
}>;

/**
 * Validates the entire form, several fields and field arrays or a singel field
 * or field array.
 *
 * @param form The form to be validated.
 * @param arg2 The name of the fields to be validated or the validation options.
 * @param arg3 The validation options.
 *
 * @returns Whether the fields are valid.
 */
export async function validate<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  arg2?:
    | TFieldName
    | TFieldArrayName
    | (TFieldName | TFieldArrayName)[]
    | ValidateOptions,
  arg3?: ValidateOptions
): Promise<boolean> {
  // Filter names between field and field arrays
  const [fieldNames, fieldArrayNames] = getFilteredNames(form, arg2);

  // Destructure options and set default values
  const { shouldActive = true, shouldFocus = true } = getOptions(arg2, arg3);

  // Create unique validator ID and add it to list
  const validator = getUniqueId();
  form.internal.validators.add(validator);

  // Set validating to "true"
  form.internal.setValidating(true);

  // Create valid variable
  let valid = true;

  // Sync state updates and prevent unnecessary recalculation
  await batch(async () => {
    // Ignores tracking of reactive dependencies
    await untrack(async () => {
      // Validate each field in list
      await Promise.all(
        fieldNames.map(async (name) => {
          // Get specified field
          const field = getField(form, name);

          // Continue if field corresponds to filter options
          if (!shouldActive || field.getActive()) {
            // Create error variable
            let error = '';

            // Run each validation functions
            for (const validation of field.validate) {
              error = await validation(field.getInput());

              // Break loop if an error occurs
              if (error) {
                // Set valid to "false" if it is still "true"
                if (valid) {
                  valid = false;

                  // Focus first field with an error if specified
                  if (shouldFocus) {
                    focus(form, name);
                  }
                }

                break;
              }
            }

            // Update error state of field
            field.setError(error);
          }
        })
      );

      // Validate each field array in list
      await Promise.all(
        fieldArrayNames.map(async (name) => {
          // Get specified field array
          const fieldArray = getFieldArray(form, name);

          // Continue if field array corresponds to filter options
          if (!shouldActive || fieldArray.getActive()) {
            // Create error variable
            let error = '';

            // Run each validation functions
            for (const validation of fieldArray.validate) {
              error = await validation(fieldArray.getItems());

              // Break loop and valid to "false" if an error occurs
              if (error) {
                valid = false;
                break;
              }
            }

            // Update error state of field
            fieldArray.setError(error);
          }
        })
      );

      // Update invalid state of form
      form.internal.setInvalid(
        [...form.internal.fields].some(
          ([_, field]) => field.getActive() && field.getError()
        )
      );

      // Delete validator from list
      form.internal.validators.delete(validator);

      // Set validating to "false" if there is no other validator
      if (!form.internal.validators.size) {
        form.internal.setValidating(false);
      }
    });
  });

  // Return whether fields are valid
  return valid;
}
