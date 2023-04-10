import type { FieldValues, Maybe, ResponseData } from '@modular-forms/shared';
import type {
  FieldArrayPath,
  FieldPath,
  FieldValue,
  FormStore,
} from '../types';
import { getFieldStore } from './getFieldStore';

type FieldValuesOptions<TInitialValue> = {
  initialValue: TInitialValue;
  replacePrefix?: Maybe<string>;
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
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TInitialValue extends [] | {}
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
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
      // Split name into keys to be able to add values of nested fields
      (replacePrefix ? name.replace(replacePrefix, '') : name)
        .split('.')
        .reduce<any>(
          (object, key, index, keys) =>
            (object[key] =
              index === keys.length - 1
                ? // If it is last key, add value
                  field.value
                : // Otherwise return object or array
                  (typeof object[key] === 'object' && object[key]) ||
                  (isNaN(+keys[index + 1]) ? {} : [])),
          values
        );
    }

    // Return modified values object
    return values;
  }, initialValue);
}
