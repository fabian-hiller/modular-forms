import type {
  FieldArrayPath,
  FieldPath,
  FieldPathValue,
  FieldValues,
  Maybe,
  ResponseData,
} from '@modular-forms/shared';
import type { FieldValue, FormStore } from '../types';
import { getFieldStore } from '../utils';

type ValueOptions = Partial<{
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
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName,
  options: ValueOptions = {}
): Maybe<FieldPathValue<TFieldValues, TFieldName, FieldValue>> {
  // Destructure options and set default values
  const {
    shouldActive = true,
    shouldTouched = false,
    shouldDirty = false,
    shouldValid = false,
  } = options;

  // Get store of specified field
  const field = getFieldStore(form, name);

  // Continue if field corresponds to filter options
  if (
    (!shouldActive || field.active) &&
    (!shouldTouched || field.touched) &&
    (!shouldDirty || field.dirty) &&
    (!shouldValid || !field.error)
  ) {
    // Return value of field
    return field.value;
  }

  // Otherwise return undefined
  return undefined;
}
