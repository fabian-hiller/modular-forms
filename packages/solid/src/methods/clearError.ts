import type {
  FieldValues,
  ResponseData,
  FormStore,
  FieldPath,
  FieldArrayPath,
  Maybe,
} from '../types/index.js';
import { setError, type SetErrorOptions } from './setError';

/**
 * Clears the error of the specified field or field array.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 * @param options The error options.
 */
export function clearError<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>,
  options?: Maybe<SetErrorOptions>
): void {
  setError(form, name, '', options);
}
