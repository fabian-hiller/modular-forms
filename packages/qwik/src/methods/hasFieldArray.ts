import type {
  FieldArrayPath,
  FieldValues,
  FormStore,
  Maybe,
  ResponseData,
} from '../types';
import { getFieldArrayStore } from '../utils';

/**
 * Value type of the has field array options.
 */
export type HasFieldArrayOptions = Partial<{
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
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: FieldArrayPath<TFieldValues>,
  {
    shouldActive = true,
    shouldTouched = false,
    shouldDirty = false,
    shouldValid = false,
  }: Maybe<HasFieldArrayOptions> = {}
): boolean {
  // Get store of specified field array
  const fieldArray = getFieldArrayStore(form, name);

  // Return whether field array is present and matches filter options
  return (
    !!fieldArray &&
    (!shouldActive || fieldArray.active) &&
    (!shouldTouched || fieldArray.touched) &&
    (!shouldDirty || fieldArray.dirty) &&
    (!shouldValid || !fieldArray.error)
  );
}
