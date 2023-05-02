import { batch } from '@preact/signals';
import type {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldValues,
  FormStore,
  Maybe,
  PartialValues,
  ResponseData,
} from '../types';
import { getUniqueId, initializeFieldArrayStore } from '../utils';
import { setValue } from './setValue';
import { validate } from './validate';

/**
 * Value type of the set values options.
 */
export type SetValuesOptions = Partial<{
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValidate: boolean;
  shouldFocus: boolean;
}>;

/**
 * Sets multiple values of the form at once.
 *
 * @param form The form store.
 * @param values The values to be set.
 * @param options The values options.
 */
export function setValues<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  values: PartialValues<TFieldValues>,
  options?: Maybe<SetValuesOptions>
): void;

/**
 * Sets multiple values of a field array at once.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param values The values to be set.
 * @param options The values options.
 */
export function setValues<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldArrayName,
  values: FieldArrayPathValue<TFieldValues, TFieldArrayName>,
  options?: Maybe<SetValuesOptions>
): void;

export function setValues<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  arg2: PartialValues<TFieldValues> | TFieldArrayName,
  arg3?: Maybe<
    SetValuesOptions | FieldArrayPathValue<TFieldValues, TFieldArrayName>
  >,
  arg4?: Maybe<SetValuesOptions>
): void {
  // Check if values of a field array should be set
  const isFieldArray = typeof arg2 === 'string';

  // Get values from arguments
  const values = (isFieldArray ? arg3 : arg2) as
    | PartialValues<TFieldValues>
    | FieldArrayPathValue<TFieldValues, TFieldArrayName>;

  // Get options from arguments
  const options = ((isFieldArray ? arg4 : arg3) || {}) as SetValuesOptions;

  // Destructure options and set default values
  const {
    shouldTouched = true,
    shouldDirty = true,
    shouldValidate = true,
    shouldFocus = true,
  } = options;

  // Create list of field and field array names
  const names: (FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>)[] =
    isFieldArray ? [arg2] : [];

  batch(() => {
    // Create function to set items of field array
    const setFieldArrayItems = (
      name: FieldArrayPath<TFieldValues>,
      value: any[]
    ) => {
      // Initialize store of specified field array
      const fieldArray = initializeFieldArrayStore(form, name);

      // Set array items
      fieldArray.items.value = value.map(() => getUniqueId());

      // Update touched if set to "true"
      if (shouldTouched) {
        fieldArray.touched.value = true;
        form.touched.value = true;
      }

      // Update dirty if set to "true"
      if (shouldDirty) {
        fieldArray.dirty.value = true;
        form.dirty.value = true;
      }
    };

    // Create recursive function to set nested values
    const setNestedValues = (data: object, prevPath?: string) =>
      Object.entries(data).forEach(([path, value]) => {
        // Create new compound path
        const compoundPath = prevPath ? `${prevPath}.${path}` : path;

        // Set value of fields
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          setValue(form, compoundPath as FieldPath<TFieldValues>, value, {
            ...options,
            shouldValidate: false,
          });

          // Add name of field or field array to list
          names.push(
            compoundPath as
              | FieldPath<TFieldValues>
              | FieldArrayPath<TFieldValues>
          );
        }

        // Set items of field arrays
        if (Array.isArray(value)) {
          setFieldArrayItems(
            compoundPath as FieldArrayPath<TFieldValues>,
            value
          );
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
  });
}
