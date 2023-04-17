import { createMemo } from 'solid-js';
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
 * @param options The field array options.
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
  // eslint-disable-next-line solid/reactivity
  return createMemo(() => {
    // Get store of specified field array
    const fieldArray = getFieldArrayStore(form, name);

    // If field array is not present, set listener to be notified when a new
    // field array is added
    if (!fieldArray) {
      form.internal.getFieldArrayNames();
    }

    // Return whether field array is present and matches filter options
    return (
      !!fieldArray &&
      (!shouldActive || fieldArray.getActive()) &&
      (!shouldTouched || fieldArray.getTouched()) &&
      (!shouldDirty || fieldArray.getDirty()) &&
      (!shouldValid || !fieldArray.getError())
    );
  })();
}
