import type {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldValues,
  FormStore,
  PartialValues,
  ResponseData,
} from '../types';
import { getUniqueId, initializeFieldArrayStore } from '../utils';
import { setValue } from './setValue';
import { validate } from './validate';

type ValuesOptions = Partial<{
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValidate: boolean;
  shouldFocus: boolean;
}>;

/**
 * Sets multiple values of the form or a field array at once.
 *
 * @param form The form store.
 * @param values The values to be set.
 * @param options The values options.
 */
export function setValues<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  values: PartialValues<TFieldValues>,
  options?: ValuesOptions
): void;

/**
 * Sets multiple values of the form or a field array at once.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param values The values to be set.
 * @param options The values options.
 */
export function setValues<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldArrayName,
  values: FieldArrayPathValue<TFieldValues, TFieldArrayName>,
  options?: ValuesOptions
): void;

export function setValues<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  arg2: PartialValues<TFieldValues> | TFieldArrayName,
  arg3?: ValuesOptions | FieldArrayPathValue<TFieldValues, TFieldArrayName>,
  arg4?: ValuesOptions
): void {
  // Check if values of a field array should be set
  const isFieldArray = typeof arg2 === 'string';

  // Get values from arguments
  const values = (isFieldArray ? arg3 : arg2) as
    | PartialValues<TFieldValues>
    | FieldArrayPathValue<TFieldValues, TFieldArrayName>;

  // Get options from arguments
  const options = ((isFieldArray ? arg4 : arg3) || {}) as ValuesOptions;

  // Destructure options and set default values
  const {
    shouldTouched = true,
    shouldDirty = true,
    shouldValidate = true,
    shouldFocus = true,
  } = options;

  // Create list of field and field array names
  const names: (TFieldName | TFieldArrayName)[] = isFieldArray ? [arg2] : [];

  // Create function to set items of field array
  const setFieldArrayItems = (name: TFieldArrayName, value: any[]) => {
    // Create array items
    const items = value.map(() => getUniqueId());

    // Initialize store of specified field array
    const fieldArray = initializeFieldArrayStore(form, name, { items });

    // Set array items
    fieldArray.items = items;

    // Update touched if set to "true"
    if (shouldTouched) {
      fieldArray.touched = true;
      form.touched = true;
    }

    // Update dirty if set to "true"
    if (shouldDirty) {
      fieldArray.dirty = true;
      form.dirty = true;
    }
  };

  // Create recursive function to set nested values
  const setNestedValues = (data: object, prevPath?: string) =>
    Object.entries(data).forEach(([path, value]) => {
      // Create new compound path
      const compoundPath = prevPath ? `${prevPath}.${path}` : path;

      // Set value of fields
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        setValue(form, compoundPath as TFieldName, value, {
          ...options,
          shouldValidate: false,
        });

        // Add name of field or field array to list
        names.push(compoundPath as TFieldName | TFieldArrayName);
      }

      // Set items of field arrays
      if (Array.isArray(value)) {
        setFieldArrayItems(compoundPath as TFieldArrayName, value);
      }

      // Set values of nested fields and field arrays
      if (value && typeof value === 'object') {
        setNestedValues(value, compoundPath);
      }
    });

  // Set field array items if necessary
  if (isFieldArray) {
    setFieldArrayItems(
      arg2 as TFieldArrayName,
      arg3 as FieldArrayPathValue<TFieldValues, TFieldArrayName>
    );
  }

  // Set nested values of specified values
  setNestedValues(values, isFieldArray ? arg2 : undefined);

  // Validate if set to "true" and necessary
  if (
    shouldValidate &&
    ['touched', 'input'].includes(
      form.internal.validateOn === 'submit' && form.submitted
        ? form.internal.revalidateOn
        : form.internal.validateOn
    )
  ) {
    validate(form, names, { shouldFocus });
  }
}
