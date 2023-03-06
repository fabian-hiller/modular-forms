import type {
  FieldArrayPath,
  FieldPath,
  FieldPathValue,
  FieldValues,
  FormStore,
} from '../types';
import { getFieldStore, updateFieldDirty, validateIfRequired } from '../utils';

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
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TFieldName, TFieldArrayName>,
  name: TFieldName,
  value: FieldPathValue<TFieldValues, TFieldName>,
  options: ValueOptions = {}
): void {
  // Destructure options and set default values
  const {
    shouldTouched = true,
    shouldDirty = true,
    shouldValidate = true,
    shouldFocus = true,
  } = options;

  // Get store of specified field
  const field = getFieldStore(form, name);

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
