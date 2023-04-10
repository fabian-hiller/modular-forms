import { FieldValues } from '@modular-forms/shared';
import { untrack } from 'solid-js';
import { FieldArrayPath, FieldPath, FieldValue, FormState } from '../types';

/**
 * Returns a tuple with filtered field and field array names. For each
 * specified field array name, the names of the contained fields and field
 * arrays are also returned. If no name is specified, the name of each field
 * and field array of the form is returned.
 *
 * @param form The form of the fields and field arrays.
 * @param arg2 The specified name or names or an object with options.
 *
 * @returns A tuple with the filtered names.
 */
export function getFilteredNames<
  TFieldValues extends FieldValues<FieldValue>,
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
): [TFieldName[], TFieldArrayName[]] {
  // Get all field and field array names of form
  const allFieldNames = untrack(form.internal.getFieldNames) as TFieldName[];
  const allFieldArrayNames = untrack(
    form.internal.getFieldArrayNames
  ) as TFieldArrayName[];

  // If names are specified, filter and return them
  if (typeof arg2 === 'string' || Array.isArray(arg2)) {
    return (typeof arg2 === 'string' ? [arg2] : arg2)
      .reduce(
        (tuple, name) => {
          // Destructure tuple
          const [fieldNameSet, fieldArrayNameSet] = tuple;

          // If it is name of a field, add it to field name set
          if (form.internal.fields.has(name)) {
            fieldNameSet.add(name as TFieldName);

            // If it is name of a field array, add it and name of each field
            // and field array it contains to field and field array name set
          } else if (form.internal.fieldArrays.has(name)) {
            allFieldArrayNames.forEach((fieldArrayName) => {
              if (fieldArrayName.startsWith(name)) {
                fieldArrayNameSet.add(fieldArrayName);
              }
            });
            allFieldNames.forEach((fieldName) => {
              if (fieldName.startsWith(name)) {
                fieldNameSet.add(fieldName);
              }
            });
          }

          // Return tuple
          return tuple;
        },
        [new Set(), new Set()] as [Set<TFieldName>, Set<TFieldArrayName>]
      )
      .map((set) => [...set]) as [TFieldName[], TFieldArrayName[]];
  }

  // Otherwise return every field and field array name
  return [allFieldNames, allFieldArrayNames];
}
