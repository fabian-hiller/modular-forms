import { untrack } from 'solid-js';
import { FieldArrayPath, FieldPath, FieldValues, FormState } from '../types';
import { getFieldArray } from './getFieldArray';

/**
 * Returns a tuple with filtered field and field array names. For each
 * contained array name all fields of the array are added to the field names.
 *
 *  For every field
 * of a field array
 *
 * @param form The form of the fields and field arrays.
 * @param names The list of field and field array names.
 *
 * @returns A tuple with the filtered names.
 */
export function getFilteredNames<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  names: (TFieldName | TFieldArrayName)[]
): [TFieldName[], TFieldArrayName[]] {
  // Get all field names of form
  const allFieldNames = untrack(form.internal.getFieldNames);

  // Get all field array names of form
  const allArrayFieldNames = [...form.internal.fieldArrays].map(
    ([name]) => name
  );

  // Return tuple with filtered field and field array names
  return names.reduce(
    (nameTuple, name) => {
      // Destructure name tuple
      const [fieldNames, fieldArrayNames] = nameTuple;

      // If name is form a field array, add it to field array names
      if (allArrayFieldNames.includes(name)) {
        fieldArrayNames.push(name as TFieldArrayName);

        // Get array items to set a listener and be notified when there is a
        // change when used within an effect
        getFieldArray(form, name as TFieldArrayName).getItems();

        // Add every name of field of field array to field names
        allFieldNames.forEach((fieldName) => {
          if (fieldName.startsWith(name)) {
            fieldNames.push(fieldName as TFieldName);
          }
        });

        // Otherwise add name to field names
      } else {
        fieldNames.push(name as TFieldName);
      }

      // Return name tuple
      return nameTuple;
    },
    [[], []] as [TFieldName[], TFieldArrayName[]]
  );
}
