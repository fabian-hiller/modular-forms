import type {
  FieldValues,
  ResponseData,
  FieldPath,
  FieldArrayPath,
  FormStore,
  Maybe,
  ValidateOptions,
} from '@modular-forms/core';
import { validate as validateMethod } from '@modular-forms/core';

/**
 * Validates the entire form, several fields and field arrays or a single field
 * or field array.
 *
 * @param form The form to be validated.
 * @param options The validation options.
 *
 * @returns Whether the fields are valid.
 */
export async function validate<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  options?: Maybe<ValidateOptions>
): Promise<boolean>;

/**
 * Validates the entire form, several fields and field arrays or a single field
 * or field array.
 *
 * @param form The form to be validated.
 * @param name The field or field array to be validated.
 * @param options The validation options.
 *
 * @returns Whether the fields are valid.
 */
export async function validate<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>,
  options?: Maybe<ValidateOptions>
): Promise<boolean>;

/**
 * Validates the entire form, several fields and field arrays or a single field
 * or field array.
 *
 * @param form The form to be validated.
 * @param names The fields and field arrays to be validated.
 * @param options The validation options.
 *
 * @returns Whether the fields are valid.
 */
export async function validate<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  names: (FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>)[],
  options?: Maybe<ValidateOptions>
): Promise<boolean>;

export async function validate<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  arg2?: Maybe<
    | FieldPath<TFieldValues>
    | FieldArrayPath<TFieldValues>
    | (FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>)[]
    | ValidateOptions
  >,
  arg3?: Maybe<ValidateOptions>
): Promise<boolean> {
  return validateMethod({}, form, arg2, arg3);
}
