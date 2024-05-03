import { batch } from 'solid-js';
import type {
  FieldPath,
  FieldPathValue,
  FieldValues,
  FormStore,
  Maybe,
  ResponseData,
} from '../types/index.js';
import {
  initializeFieldStore,
  updateFieldDirty,
  validateIfRequired,
} from '../utils';

/**
 * Value type of the set value options.
 */
export type SetValueOptions = Partial<{
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
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldName,
  value: FieldPathValue<TFieldValues, TFieldName>,
  {
    shouldTouched = true,
    shouldDirty = true,
    shouldValidate = true,
    shouldFocus = true,
  }: Maybe<SetValueOptions> = {}
): void {
  batch(() => {
    // Initialize store of specified field
    const field = initializeFieldStore(form, name);

    // Set new value
    field.value.set(() => value);

    // Update touched if set to "true"
    if (shouldTouched) {
      field.touched.set(true);
      form.internal.touched.set(true);
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
  });
}
