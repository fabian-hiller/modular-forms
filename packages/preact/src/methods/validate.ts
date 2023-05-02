import { batch } from '@preact/signals';
import type {
  FieldValues,
  ResponseData,
  FormStore,
  Maybe,
  FieldPath,
  FieldArrayPath,
  FormErrors,
} from '../types';
import {
  getFilteredNames,
  getOptions,
  getUniqueId,
  getFieldStore,
  getFieldArrayStore,
  setErrorResponse,
  updateFormInvalid,
} from '../utils';
import { focus } from './focus';
import { getValues } from './getValues';

/**
 * Value type of the validate options.
 */
export type ValidateOptions = Partial<{
  shouldActive: boolean;
  shouldFocus: boolean;
}>;

/**
 * Validates the entire form.
 *
 * @param form The form to be validated.
 * @param options The validation options.
 *
 * @returns Whether the fields are valid.
 */
export async function validate<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  options?: Maybe<ValidateOptions>
): Promise<boolean>;

/**
 * Validates a single field or field array.
 *
 * @param form The form to be validated.
 * @param name The field or field array to be validated.
 * @param options The validation options.
 *
 * @returns Whether the fields are valid.
 */
export async function validate<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>,
  options?: Maybe<ValidateOptions>
): Promise<boolean>;

/**
 * Validates several fields and field arrays.
 *
 * @param form The form to be validated.
 * @param names The fields and field arrays to be validated.
 * @param options The validation options.
 *
 * @returns Whether the fields are valid.
 */
export async function validate<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  names: (FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>)[],
  options?: Maybe<ValidateOptions>
): Promise<boolean>;

export async function validate<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  arg2?: Maybe<
    | FieldPath<TFieldValues>
    | FieldArrayPath<TFieldValues>
    | (FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>)[]
    | ValidateOptions
  >,
  arg3?: Maybe<ValidateOptions>
): Promise<boolean> {
  // Filter names between field and field arrays
  const [fieldNames, fieldArrayNames] = getFilteredNames(form, arg2);

  // Destructure options and set default values
  const { shouldActive = true, shouldFocus = true } = getOptions(arg2, arg3);

  // Create unique validator ID and add it to list
  const validator = getUniqueId();
  form.internal.validators.add(validator);

  // Set validating to "true"
  form.validating.value = true;

  // Run form validation function
  const formErrors: FormErrors<TFieldValues> = form.internal.validate
    ? await form.internal.validate(
        getValues(form, { shouldActive, peek: true })
      )
    : {};

  // Create valid variable
  let valid = !Object.keys(formErrors).length;

  const [errorFields] = await Promise.all([
    // Validate each field in list
    Promise.all(
      fieldNames.map(async (name) => {
        // Get store of specified field
        const field = getFieldStore(form, name)!;

        // Continue if field corresponds to filter options
        if (!shouldActive || field.active.peek()) {
          // Create local error variable
          let localError: string | undefined;

          // Run each field validation functions
          for (const validation of field.validate) {
            localError = await validation(field.value.peek());

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
          field.error.value = fieldError;

          // Return name if field has an error
          return fieldError ? name : null;
        }
      })
    ),

    // Validate each field array in list
    Promise.all(
      fieldArrayNames.map(async (name) => {
        // Get store of specified field array
        const fieldArray = getFieldArrayStore(form, name)!;

        // Continue if field array corresponds to filter options
        if (!shouldActive || fieldArray.active.peek()) {
          // Create local error variable
          let localError = '';

          // Run each field array validation functions
          for (const validation of fieldArray.validate) {
            localError = await validation(fieldArray.items.peek());

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
          fieldArray.error.value = fieldArrayError;
        }
      })
    ),
  ]);

  batch(() => {
    // Set error response if necessary
    setErrorResponse(form, formErrors, { shouldActive });

    // Focus first field with an error if specified
    if (shouldFocus) {
      const name = errorFields.find((name) => name);
      if (name) {
        focus(form, name);
      }
    }

    // Update invalid state of form
    updateFormInvalid(form, !valid);

    // Delete validator from list
    form.internal.validators.delete(validator);

    // Set validating to "false" if there is no other validator
    if (!form.internal.validators.size) {
      form.validating.value = false;
    }
  });

  // Return whether fields are valid
  return valid;
}
