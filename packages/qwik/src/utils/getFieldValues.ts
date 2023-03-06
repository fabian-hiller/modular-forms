import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
} from '../types';
import { getFieldStore } from './getFieldStore';

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
 * TODO: Remove "any" and improve types
 *
 * @param form The form that contains the fields.
 * @param names The name of the fields.
 * @param options The field values options.
 *
 * @returns The values of the specified fields.
 */
export function getFieldValues<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TInitialValue extends [] | {}
>(
  form: FormStore<TFieldValues, TFieldName, TFieldArrayName>,
  names: TFieldName[],
  options: FieldValuesOptions<TInitialValue>
): TInitialValue extends [] ? Array<any> : Record<string, any> {
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
    // Get store of specified field
    const field = getFieldStore(form, name);

    // Add value if field corresponds to filter options
    if (
      (!shouldActive || field.active) &&
      (!shouldTouched || field.touched) &&
      (!shouldDirty || field.dirty) &&
      (!shouldValid || !field.error)
    ) {
      // Split name into path list to be able to add values of nested fields
      (replacePrefix ? name.replace(replacePrefix, '') : name)
        .split('.')
        .reduce<any>((object, key, index, pathList) => {
          // Get current value of object
          const currentValue = object[key];

          // If current key is last key of path list, use value of field as
          // next value
          const nextValue =
            index === pathList.length - 1
              ? field.value
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
  }, initialValue);
}
