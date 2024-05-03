import { createMemo } from 'solid-js';
import type {
  FieldPath,
  FieldValues,
  FormStore,
  Maybe,
  ResponseData,
} from '../types/index.js';
import { getFieldStore } from '../utils';

/**
 * Value type of the has field options.
 */
export type HasFieldOptions = Partial<{
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValid: boolean;
}>;

/**
 * Checks if the specified field is included in the form.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 * @param options The field options.
 *
 * @returns Whether the field is included.
 */
export function hasField<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: FieldPath<TFieldValues>,
  {
    shouldActive = true,
    shouldTouched = false,
    shouldDirty = false,
    shouldValid = false,
  }: Maybe<HasFieldOptions> = {}
): boolean {
  // eslint-disable-next-line solid/reactivity
  return createMemo(() => {
    // Get store of specified field
    const field = getFieldStore(form, name);

    // If field is not present, set listener to be notified when a new field is
    // added
    if (!field) {
      form.internal.fieldNames.get();
    }

    // Return whether field is present and matches filter options
    return (
      !!field &&
      (!shouldActive || field.active.get()) &&
      (!shouldTouched || field.touched.get()) &&
      (!shouldDirty || field.dirty.get()) &&
      (!shouldValid || !field.error.get())
    );
  })();
}
