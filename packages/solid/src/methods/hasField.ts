import { FieldPath, FieldValues } from '@modular-forms/shared';
import { createMemo } from 'solid-js';
import { FieldValue, FormState } from '../types';
import { getField } from '../utils';

type FieldOptions = Partial<{
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValid: boolean;
}>;

/**
 * Checks if the specified field is included in the form.
 *
 * @param form The form that may contain the field.
 * @param name The name of the field.
 *
 * @returns Whether the field is included.
 */
export function hasField<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues, FieldValue>
>(
  form: FormState<TFieldValues>,
  name: TFieldName | string,
  options: FieldOptions = {}
): boolean {
  // Destructure options and set default values
  const {
    shouldActive = true,
    shouldTouched = false,
    shouldDirty = false,
    shouldValid = false,
  } = options;

  // Create reactive memoized signal and return its value
  return createMemo(() => {
    // If field is present, check filter options
    if (form.internal.fields.has(name)) {
      // Get specified field
      const field = getField(form, name as TFieldName);

      // Return whether field matches filter options
      return (
        (!shouldActive || field.getActive()) &&
        (!shouldTouched || field.getTouched()) &&
        (!shouldDirty || field.getDirty()) &&
        (!shouldValid || !field.getError())
      );
    }

    // Otherwise, get field names to set a listener and be notified when there
    // is a change and return false
    form.internal.getFieldNames();
    return false;
  })();
}
