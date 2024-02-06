import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  Maybe,
  ResponseData,
} from '../types/index.js';
import { getFieldStore, getFieldArrayStore } from '../utils';

/**
 * Value type of the get error options.
 */
export type GetErrorOptions = Partial<{
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
}>;

/**
 * Returns the error of the specified field or field array.
 *
 * @param form The form of the field or field array.
 * @param name The name of the field or field array.
 *
 * @returns The error of the field or field array.
 */
export function getError<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>,
  {
    shouldActive = true,
    shouldTouched = false,
    shouldDirty = false,
  }: Maybe<GetErrorOptions> = {}
): string | undefined {
  // Get store of specified field or field array
  const field = getFieldStore(form, name as FieldPath<TFieldValues>);
  const fieldArray = getFieldArrayStore(
    form,
    name as FieldArrayPath<TFieldValues>
  );

  // Return error if field or field array is present and corresponds to filter
  // options
  for (const fieldOrFieldArray of [field, fieldArray]) {
    if (
      fieldOrFieldArray &&
      (!shouldActive || fieldOrFieldArray.active.get()) &&
      (!shouldTouched || fieldOrFieldArray.touched.get()) &&
      (!shouldDirty || fieldOrFieldArray.dirty.get())
    ) {
      return fieldOrFieldArray.error.get();
    }
  }

  // If field and field array is not present, set listeners to be notified when
  // a new field or field array is added
  if (!field && !fieldArray) {
    form.internal.fieldNames.get();
    form.internal.fieldArrayNames.get();
  }

  // Otherwise return undefined
  return undefined;
}
