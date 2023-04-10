import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  Maybe,
  ResponseData,
} from '@modular-forms/shared';
import type { FieldStore, FieldValue, FormStore } from '../types';
import { getFieldStore } from '../utils';

type FieldOptions = Partial<{
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
 *
 * @returns Whether the field is included.
 */
export function hasField<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
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

  // Get store of specified field
  const field = getFieldStore(form, name as TFieldName) as Maybe<
    FieldStore<TFieldValues, TFieldName>
  >;

  // Return whether field is present and matches filter options
  return (
    !!field &&
    (!shouldActive || field.active) &&
    (!shouldTouched || field.touched) &&
    (!shouldDirty || field.dirty) &&
    (!shouldValid || !field.error)
  );
}
