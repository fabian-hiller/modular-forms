import type {
  ErrorOptions,
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  Maybe,
  ResponseData,
} from '@modular-forms/core';
import { setError as setErrorMethod } from '@modular-forms/core';
import { batch, untrack } from 'solid-js';

/**
 * Sets the error of the specified field or field array.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 * @param error The error message.
 * @param options The error options.
 */
export function setError<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>,
  error: string,
  options?: Maybe<ErrorOptions>
): void {
  batch(() => untrack(() => setErrorMethod(form, name, error, options)));
}
