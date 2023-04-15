import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  Maybe,
  PartialValues,
  ResponseData,
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
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  arg2?: Maybe<
    | FieldArrayPath<TFieldValues>
    | (FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>)[]
    | ValuesOptions
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

  // If no name is specified, set listener to be notified when a new field is
  // added
  if (typeof arg2 !== 'string' && !Array.isArray(arg2)) {
    form.internal.fieldNames;
  }

  // Return object that contains values of fields
  return getFieldValues(form, getFilteredNames(form, arg2)[0], {
    initialValue: typeof arg2 === 'string' ? [] : {},
    shouldActive,
    shouldTouched,
    shouldDirty,
    shouldValid,
  }) as PartialValues<TFieldValues>;
}
