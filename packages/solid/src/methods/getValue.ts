import type {
  FieldPath,
  FieldPathValue,
  FieldValues,
  FormStore,
  Maybe,
  ResponseData,
} from '../types/index.js';
import { initializeFieldStore } from '../utils';

/**
 * Value type if the get value options.
 */
export type GetValueOptions = Partial<{
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValid: boolean;
}>;

/**
 * Returns the value of the specified field.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 * @param options The value options.
 *
 * @returns The value of the field.
 */
export function getValue<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldName,
  {
    shouldActive = true,
    shouldTouched = false,
    shouldDirty = false,
    shouldValid = false,
  }: Maybe<GetValueOptions> = {}
): Maybe<FieldPathValue<TFieldValues, TFieldName>> {
  // Get store of specified field
  const field = initializeFieldStore(form, name);

  // Continue if field corresponds to filter options
  if (
    (!shouldActive || field.active.get()) &&
    (!shouldTouched || field.touched.get()) &&
    (!shouldDirty || field.dirty.get()) &&
    (!shouldValid || !field.error.get())
  ) {
    // Return value of field
    return field.value.get();
  }

  // Otherwise return undefined
  return undefined;
}
