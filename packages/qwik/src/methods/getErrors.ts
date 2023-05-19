import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormErrors,
  FormStore,
  Maybe,
  ResponseData,
} from '../types';
import {
  getFieldArrayStore,
  getFieldStore,
  getFilteredNames,
  getOptions,
} from '../utils';

/**
 * Value type of the get errors options.
 */
export type GetErrorsOptions = Partial<{
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
}>;

/**
 * Returns the current errors of the form fields.
 *
 * @param form The form of the fields.
 * @param options The errors options.
 *
 * @returns The form errors.
 */
export function getErrors<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  options?: Maybe<GetErrorsOptions>
): FormErrors<TFieldValues>;

/**
 * Returns the errors of the specified field array.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The errors options.
 *
 * @returns The form errors.
 */
export function getErrors<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldArrayName,
  options?: Maybe<GetErrorsOptions>
): FormErrors<TFieldValues>;

/**
 * Returns the current errors of the specified fields and field arrays.
 *
 * @param form The form of the fields.
 * @param names The names of the fields and field arrays.
 * @param options The errors options.
 *
 * @returns The form errors.
 */
export function getErrors<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  names: (FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>)[],
  options?: Maybe<GetErrorsOptions>
): FormErrors<TFieldValues>;

export function getErrors<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  arg2?: Maybe<
    | FieldArrayPath<TFieldValues>
    | (FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>)[]
    | GetErrorsOptions
  >,
  arg3?: Maybe<GetErrorsOptions>
): FormErrors<TFieldValues> {
  // Get filtered field names to get error from
  const [fieldNames, fieldArrayNames] = getFilteredNames(form, arg2);

  // Destructure options and set default values
  const {
    shouldActive = true,
    shouldTouched = false,
    shouldDirty = false,
  } = getOptions(arg2, arg3);

  // Create and return object with form errors
  return [
    ...fieldNames.map((name) => [name, getFieldStore(form, name)!] as const),
    ...fieldArrayNames.map(
      (name) => [name, getFieldArrayStore(form, name)!] as const
    ),
  ].reduce<FormErrors<TFieldValues>>(
    (formErrors, [name, fieldOrFieldArray]) => {
      if (
        fieldOrFieldArray.error &&
        (!shouldActive || fieldOrFieldArray.active) &&
        (!shouldTouched || fieldOrFieldArray.touched) &&
        (!shouldDirty || fieldOrFieldArray.dirty)
      ) {
        formErrors[name] = fieldOrFieldArray.error;
      }
      return formErrors;
    },
    {}
  );
}
