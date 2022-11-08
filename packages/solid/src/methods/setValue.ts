import { batch, untrack } from 'solid-js';
import { FieldPath, FieldPathValue, FieldValues, FormState } from '../types';
import { getField, updateFieldDirty, validateIfNecessary } from '../utils';

type ValueOptions = Partial<{
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValidate: boolean;
}>;

/**
 * Sets the value of the specified field.
 *
 * @param form The form that contains the field.
 * @param name The name of the field where the value should be set.
 * @param value The value to bet set.
 * @param options The value options.
 */
export function setValue<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  name: TFieldName,
  value: FieldPathValue<TFieldValues, TFieldName>,
  options: ValueOptions = {}
): void {
  // Destructure options and set default values
  const {
    shouldTouched = true,
    shouldDirty = true,
    shouldValidate = true,
  } = options;

  // Ignores tracking of reactive dependencies
  untrack(() => {
    // Get specified field
    const field = getField(form, name);

    // Sync state updates and prevent unnecessary recalculation
    batch(() => {
      // Set input
      field.setInput(() => value);

      // Update touched if set to "true"
      if (shouldTouched) {
        field.setTouched(true);
        form.internal.setTouched(true);
      }

      // Update dirty if set to "true"
      if (shouldDirty) {
        updateFieldDirty(form, field);
      }

      // Validate if set to "true" and necessary
      if (shouldValidate) {
        validateIfNecessary(form, name, {
          on: 'input',
          shouldFocus: true,
        });
      }
    });
  });
}
