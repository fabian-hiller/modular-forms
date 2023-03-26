import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  Maybe,
  PartialValues,
} from '../types';
import { getFieldValues, getFilteredNames, getOptions } from '../utils';

type ValuesOptions = Partial<{
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValid: boolean;
}>;

/**
 * Returns the current values of the form fields.
 *
 * @param form The form of the fields.
 * @param arg2 The name of the fields or the values options.
 * @param arg3 The values options.
 *
 * @returns The form field values.
 */
export function getValues<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TFieldName, TFieldArrayName>,
  arg2?: Maybe<
    TFieldArrayName | (TFieldName | TFieldArrayName)[] | ValuesOptions
  >,
  arg3?: Maybe<ValuesOptions>
): PartialValues<TFieldValues> {
  // Destructure options and set default values
  const {
    shouldActive = true,
    shouldTouched = false,
    shouldDirty = false,
    shouldValid = false,
  } = getOptions(arg2, arg3);

  // Return object that contains values of fields
  return getFieldValues(form, getFilteredNames(form, arg2)[0], {
    initialValue: typeof arg2 === 'string' ? [] : {},
    shouldActive,
    shouldTouched,
    shouldDirty,
    shouldValid,
  }) as PartialValues<TFieldValues>;
}
