import { untrack } from 'solid-js';
import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  Maybe,
  ResponseData,
} from '../types';

/**
 * Returns a tuple with filtered field and field array names. For each
 * specified field array name, the names of the contained fields and field
 * arrays are also returned. If no name is specified, the name of each field
 * and field array of the form is returned.
 *
 * @param form The form of the fields.
 * @param arg2 The name of the fields.
 *
 * @returns A tuple with filtered names.
 */
export function getFilteredNames<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TOptions extends Record<string, any>
>(
  form: FormStore<TFieldValues, TResponseData>,
  arg2?: Maybe<
    | FieldPath<TFieldValues>
    | FieldArrayPath<TFieldValues>
    | (FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>)[]
    | TOptions
  >
): [FieldPath<TFieldValues>[], FieldArrayPath<TFieldValues>[]] {
  return untrack(() => {
    // Get all field and field array names of form
    const allFieldNames = form.internal.fieldNames.get();
    const allFieldArrayNames = form.internal.fieldArrayNames.get();

    // If names are specified, filter and return them
    if (typeof arg2 === 'string' || Array.isArray(arg2)) {
      return (typeof arg2 === 'string' ? [arg2] : arg2)
        .reduce(
          (tuple, name) => {
            // Destructure tuple
            const [fieldNames, fieldArrayNames] = tuple;

            // If it is name of a field array, add it and name of each field
            // and field array it contains to field and field array names
            if (
              allFieldArrayNames.includes(name as FieldArrayPath<TFieldValues>)
            ) {
              allFieldArrayNames.forEach((fieldArrayName) => {
                if (fieldArrayName.startsWith(name)) {
                  fieldArrayNames.add(fieldArrayName);
                }
              });
              allFieldNames.forEach((fieldName) => {
                if (fieldName.startsWith(name)) {
                  fieldNames.add(fieldName);
                }
              });

              // If it is name of a field, add it to field name set
            } else {
              fieldNames.add(name as FieldPath<TFieldValues>);
            }

            // Return tuple
            return tuple;
          },
          [new Set(), new Set()] as [
            Set<FieldPath<TFieldValues>>,
            Set<FieldArrayPath<TFieldValues>>
          ]
        )
        .map((set) => [...set]) as [
        FieldPath<TFieldValues>[],
        FieldArrayPath<TFieldValues>[]
      ];
    }

    // Otherwise return every field and field array name
    return [allFieldNames, allFieldArrayNames];
  });
}
