import type {
  FieldArrayPath,
  FieldPath,
  FieldPathValue,
  FieldValues,
  ResponseData,
} from '@modular-forms/shared';
import type { FieldValue, FormStore } from '../types';
import {
  initializeFieldStore,
  updateFieldDirty,
  validateIfRequired,
} from '../utils';

type ValueOptions = Partial<{
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValidate: boolean;
  shouldFocus: boolean;
}>;

/**
 * Sets the value of the specified field.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 * @param value The value to bet set.
 * @param options The value options.
 */
export function setValue<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName,
  value: FieldPathValue<TFieldValues, TFieldName, FieldValue>,
  options: ValueOptions = {}
): void {
  // Destructure options and set default values
  const {
    shouldTouched = true,
    shouldDirty = true,
    shouldValidate = true,
    shouldFocus = true,
  } = options;

  // Initialize store of specified field
  const field = initializeFieldStore(form, name, { value });

  // Set input
  field.value = value;

  // Update touched if set to "true"
  if (shouldTouched) {
    field.touched = true;
    form.touched = true;
  }

  // Update dirty if set to "true"
  if (shouldDirty) {
    updateFieldDirty(form, field);
  }

  // Validate if set to "true" and necessary
  if (shouldValidate) {
    validateIfRequired(form, field, name, {
      on: ['touched', 'input'],
      shouldFocus,
    });
  }
}
