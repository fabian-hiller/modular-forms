import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  ResponseData,
} from '../types';
import { setError } from './setError';

type ErrorOptions = Partial<{
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldFocus: boolean;
}>;

/**
 * Clears the error of the specified field or field array.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 * @param options The error options.
 */
export function clearError<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName | TFieldArrayName,
  options?: ErrorOptions
): void {
  setError(form, name, '', options);
}
