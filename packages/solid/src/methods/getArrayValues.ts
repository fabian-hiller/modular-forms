import { FieldValues } from '@modular-forms/shared';
import { untrack } from 'solid-js';
import {
  DeepPartial,
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldValue,
  FormState,
} from '../types';
import { getFieldArray, getFieldValues } from '../utils';

type ArrayValuesOptions<TTypeValidated> = Partial<{
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValid: boolean;
  typeValidated: TTypeValidated;
}>;

/**
 * Returns the values of the specified field array.
 *
 * @param form The form that contains the field array.
 * @param name The name of the field array to get the values from.
 * @param options The array values options.
 *
 * @returns The values of the field array.
 */
export function getArrayValues<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TFieldArrayValue extends FieldArrayPathValue<TFieldValues, TFieldArrayName>,
  TTypeValidated extends boolean = false
>(
  form: FormState<TFieldValues>,
  name: TFieldArrayName,
  options: ArrayValuesOptions<TTypeValidated> = {}
): TTypeValidated extends true
  ? TFieldArrayValue
  : DeepPartial<TFieldArrayValue> {
  // Destructure options and set default values
  const {
    shouldActive = true,
    shouldTouched = false,
    shouldDirty = false,
    shouldValid = false,
  } = options;

  // Get array items to set a listener and be notified when there is a change
  // when used within an effect
  getFieldArray(form, name).getItems();

  // Get every name of field of field array
  const fieldNames = untrack(form.internal.getFieldNames).filter((fieldName) =>
    fieldName.startsWith(name)
  ) as TFieldName[];

  // Return array that contains values of field array
  return getFieldValues(form, fieldNames, {
    initialValue: [],
    replacePrefix: `${name}.`,
    shouldActive,
    shouldTouched,
    shouldDirty,
    shouldValid,
  }) as TTypeValidated extends true
    ? TFieldArrayValue
    : DeepPartial<TFieldArrayValue>;
}
