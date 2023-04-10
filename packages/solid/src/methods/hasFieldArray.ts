import { FieldArrayPath, FieldValues } from '@modular-forms/shared';
import { createMemo } from 'solid-js';
import { FieldValue, FormState } from '../types';
import { getFieldArray } from '../utils';

type FieldArrayOptions = Partial<{
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValid: boolean;
}>;

/**
 * Checks if the specified field array is included in the form.
 *
 * @param form The form that may contain the field array.
 * @param name The name of the field array.
 *
 * @returns Whether the field array is included.
 */
export function hasFieldArray<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormState<TFieldValues>,
  name: TFieldArrayName | string,
  options: FieldArrayOptions = {}
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
    // If field array is present, check filter options
    if (form.internal.fieldArrays.has(name)) {
      // Get specified field array
      const fieldArray = getFieldArray(form, name as TFieldArrayName);

      // Return whether field array matches filter options
      return (
        (!shouldActive || fieldArray.getActive()) &&
        (!shouldTouched || fieldArray.getTouched()) &&
        (!shouldDirty || fieldArray.getDirty()) &&
        (!shouldValid || !fieldArray.getError())
      );
    }

    // Otherwise, get field array names to set a listener and be notified when
    // there is a change and return false
    form.internal.getFieldArrayNames();
    return false;
  })();
}
