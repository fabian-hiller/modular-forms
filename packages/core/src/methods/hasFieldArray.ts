import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  ResponseData,
} from '../types';
import { getFieldArrayStore } from '../utils';

type FieldArrayOptions = Partial<{
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValid: boolean;
}>;

/**
 * Checks if the specified field array is included in the form.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 *
 * @returns Whether the field array is included.
 */
export function hasFieldArray<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
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

  // Get store of specified field array
  const fieldArray = getFieldArrayStore(form, name as TFieldArrayName);

  // If field array is not present, set listener to be notified when a new
  // field array is added
  if (!fieldArray) {
    form.internal.fieldArrayNames;
  }

  // Return whether field array is present and matches filter options
  return (
    !!fieldArray &&
    (!shouldActive || fieldArray.active) &&
    (!shouldTouched || fieldArray.touched) &&
    (!shouldDirty || fieldArray.dirty) &&
    (!shouldValid || !fieldArray.error)
  );
}
