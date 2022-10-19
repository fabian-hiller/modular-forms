import {
  DeepPartial,
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormState,
} from '../types';
import {
  getNames,
  getOptions,
  getFilteredNames,
  getFieldValues,
} from '../utils';

type ValuesOptions<TTypeValidated> = Partial<{
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValid: boolean;
  typeValidated: TTypeValidated;
}>;

/**
 * Returns the current values of the form fields.
 *
 * @param form The form to get the values from.
 * @param arg2 The name of the fields or field arrays to get the values from or the values options.
 * @param arg3 The values options.
 *
 * @returns The current form field values.
 */
export function getValues<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TTypeValidated extends boolean = false
>(
  form: FormState<TFieldValues>,
  arg2?: (TFieldName | TFieldArrayName)[] | ValuesOptions<TTypeValidated>,
  arg3?: ValuesOptions<TTypeValidated>
): TTypeValidated extends true ? TFieldValues : DeepPartial<TFieldValues> {
  // Create list with field and field array names
  const names = getNames(form, arg2);

  // Get filtered field names to get value from
  const [fieldNames] = getFilteredNames(form, names);

  // Destructure options and set default values
  const {
    shouldActive = true,
    shouldTouched = false,
    shouldDirty = false,
    shouldValid = false,
  } = getOptions(arg2, arg3);

  // Return object that contains values of fields
  return getFieldValues(form, fieldNames, {
    initialValue: {},
    shouldActive,
    shouldTouched,
    shouldDirty,
    shouldValid,
  }) as TTypeValidated extends true ? TFieldValues : DeepPartial<TFieldValues>;
}
