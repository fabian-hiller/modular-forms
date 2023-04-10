import type {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldValues,
  ResponseData,
} from '@modular-forms/shared';
import type { FieldValue, FormStore, PartialValues } from '../types';
import { getFieldNames, getFieldValues } from '../utils';

type ArrayValuesOptions = Partial<{
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValid: boolean;
}>;

/**
 * Returns the values of the specified field array.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The array values options.
 *
 * @returns The values of the field array.
 */
export function getArrayValues<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>,
  TFieldArrayValue extends FieldArrayPathValue<
    TFieldValues,
    TFieldArrayName,
    FieldValue
  >
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldArrayName,
  options: ArrayValuesOptions = {}
): PartialValues<TFieldArrayValue> {
  // Destructure options and set default values
  const {
    shouldActive = true,
    shouldTouched = false,
    shouldDirty = false,
    shouldValid = false,
  } = options;

  // Return values of field array
  return getFieldValues(
    form,
    getFieldNames(form).filter((fieldName) => fieldName.startsWith(name)),
    {
      initialValue: [],
      replacePrefix: `${name}.`,
      shouldActive,
      shouldTouched,
      shouldDirty,
      shouldValid,
    }
  ) as PartialValues<TFieldArrayValue>;
}
