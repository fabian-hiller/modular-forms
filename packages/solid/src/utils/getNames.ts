import { FieldArrayPath, FieldPath, FieldValues, FormState } from '../types';

/**
 * Filters the name or names from the arguments and returns them as a list. If
 * no name was specified, the name of each field of the form is returned.
 *
 * @param form The form of the fields and field arrays.
 * @param arg2 The specified name or names or an object with options.
 *
 * @returns A list with field names.
 */
export function getNames<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TOptions extends Record<string, any>
>(
  form: FormState<TFieldValues>,
  arg2?:
    | TFieldName
    | TFieldArrayName
    | (TFieldName | TFieldArrayName)[]
    | TOptions
): (TFieldName | TFieldArrayName)[] {
  return typeof arg2 === 'string' || Array.isArray(arg2)
    ? typeof arg2 === 'string'
      ? // Return a single field
        [arg2]
      : // Return a list of fields
        arg2
    : // Return each field of form
      (form.internal.getFieldNames() as TFieldName[]);
}
