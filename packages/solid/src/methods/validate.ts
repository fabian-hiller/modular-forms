import {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormErrors,
} from '@modular-forms/shared';
import { batch, untrack } from 'solid-js';
import { DeepPartial, FieldValue, FormState } from '../types';
import {
  getField,
  getOptions,
  getUniqueId,
  getFilteredNames,
  getFieldArray,
} from '../utils';
import { focus } from './focus';
import { getValues } from './getValues';

type ValidateOptions = Partial<{
  shouldActive: boolean;
  shouldFocus: boolean;
}>;

/**
 * Validates the entire form, several fields and field arrays or a single field
 * or field array.
 *
 * @param form The form to be validated.
 * @param arg2 The name of the fields to be validated or the validation options.
 * @param arg3 The validation options.
 *
 * @returns Whether the fields are valid.
 */
export async function validate<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
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
      // Run form validation function
      const formErrors: FormErrors<TFieldValues, FieldValue> = form.internal
        .validate
        ? await form.internal.validate(
            getValues(form, { shouldActive }) as DeepPartial<TFieldValues>
          )
        : {};

      const [errorFields] = await Promise.all([
        // Validate each field in list
        Promise.all(
          fieldNames.map(async (name) => {
            // Get specified field
            const field = getField(form, name);

            // Continue if field corresponds to filter options
            if (!shouldActive || field.getActive()) {
              // Create local error variable
              let localError: string | undefined;

              // Run each field validation functions
              for (const validation of field.validate) {
                localError = await validation(field.getInput());

                // Break loop if an error occurred
                if (localError) {
                  break;
                }
              }

              // Create field error from local and global error
              const fieldError = localError || formErrors[name] || '';

              // Set valid to "false" if an error occurred
              if (fieldError) {
                valid = false;
              }

              // Update error state of field
              field.setError(fieldError);

              // Return name if field has an error
              return fieldError ? name : null;
            }
          })
        ),

        // Validate each field array in list
        Promise.all(
          fieldArrayNames.map(async (name) => {
            // Get specified field array
            const fieldArray = getFieldArray(form, name);

            // Continue if field array corresponds to filter options
            if (!shouldActive || fieldArray.getActive()) {
              // Create local error variable
              let localError = '';

              // Run each field array validation functions
              for (const validation of fieldArray.validate) {
                localError = await validation(fieldArray.getItems());

                // Break loop and if an error occurred
                if (localError) {
                  break;
                }
              }

              // Create field array error from local and global error
              const fieldArrayError = localError || formErrors[name] || '';

              // Set valid to "false" if an error occurred
              if (fieldArrayError) {
                valid = false;
              }

              // Update error state of field
              fieldArray.setError(fieldArrayError);
            }
          })
        ),
      ]);

      // Focus first field with an error if specified
      if (shouldFocus) {
        const name = errorFields.find((name) => name);
        if (name) {
          focus(form, name);
        }
      }

      // Update invalid state of form
      form.internal.setInvalid(
        [...form.internal.fields, ...form.internal.fieldArrays].some(
          ([, fieldOrFieldArray]) =>
            fieldOrFieldArray.getActive() && fieldOrFieldArray.getError()
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
