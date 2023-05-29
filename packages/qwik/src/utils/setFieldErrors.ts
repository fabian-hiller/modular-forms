import { setError, type SetErrorOptions } from '../methods';
import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormErrors,
  FormStore,
  Maybe,
  ResponseData,
} from '../types';

/**
 * Sets the errors for the respective fields.
 *
 * @param form The form of the fields.
 * @param errors The errors of the fields.
 * @param options The error options.
 */
export function setFieldErrors<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  errors: FormErrors<TFieldValues>,
  options: SetErrorOptions
) {
  (
    Object.entries(errors) as [
      FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>,
      Maybe<string>
    ][]
  ).forEach(([name, error]) => {
    if (error) {
      setError(form, name, error, {
        ...options,
        shouldFocus: false,
      });
    }
  });
}
