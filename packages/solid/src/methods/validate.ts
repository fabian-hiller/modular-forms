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
import { batch, untrack } from 'solid-js';

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
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
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
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName | TFieldArrayName,
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
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  names: (TFieldName | TFieldArrayName)[],
  options?: Maybe<ValidateOptions>
): Promise<boolean>;

export async function validate<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  arg2?: Maybe<
    | TFieldName
    | TFieldArrayName
    | (TFieldName | TFieldArrayName)[]
    | ValidateOptions
  >,
  arg3?: Maybe<ValidateOptions>
): Promise<boolean> {
  return validateMethod({ batch, untrack }, form, arg2, arg3);
}
