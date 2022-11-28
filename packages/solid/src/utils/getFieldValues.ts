import { FieldPath, FieldValues, FormState } from '../types';
import { getField } from './getField';

type FieldValuesOptions<TInitialValue> = {
  initialValue: TInitialValue;
  replacePrefix?: string;
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValid: boolean;
};

/**
 * Returns an object or array with the values of the specified fields.
 *
 * @param form The form that contains the fields.
 * @param names The name of the fields to get the values from.
 * @param options The field values options.
 *
 * @returns The values of the specified fields.
 */
export function getFieldValues<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TInitialValue extends [] | {}
>(
  form: FormState<TFieldValues>,
  names: TFieldName[],
  options: FieldValuesOptions<TInitialValue>
): TInitialValue extends [] ? any[] : { [key: string]: any } {
  // Destructure options
  const {
    initialValue,
    replacePrefix,
    shouldActive,
    shouldTouched,
    shouldDirty,
    shouldValid,
  } = options;

  // Create and return field values
  return names.reduce<any>((values, name) => {
    // Get specified field
    const field = getField(form, name);

    // Add value if field corresponds to filter options
    if (
      (!shouldActive || field.getActive()) &&
      (!shouldTouched || field.getTouched()) &&
      (!shouldDirty || field.getDirty()) &&
      (!shouldValid || !field.getError())
    ) {
      // Split name into path list to be able to add values of nested fields
      (replacePrefix ? name.replace(replacePrefix, '') : name)
        .split('.')
        .reduce((object, key, index, pathList) => {
          // Get current value of object
          const currentValue = object[key];

          // If current key is last key of path list, use value of field as
          // next value
          const nextValue =
            index === pathList.length - 1
              ? field.getInput()
              : // Otherwise use current value or an empty object or array
              currentValue && typeof currentValue === 'object'
              ? currentValue
              : isNaN(+pathList[index + 1])
              ? {}
              : [];

          // Add next value to object and return it
          object[key] = nextValue;
          return object[key];
        }, values);
    }

    // Return modified values object
    return values;
  }, initialValue) as TInitialValue extends [] ? any[] : { [key: string]: any };
}
