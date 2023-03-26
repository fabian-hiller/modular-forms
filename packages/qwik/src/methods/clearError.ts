import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  ResponseData,
} from '../types';
import { setError } from './setError';

/**
 * Clears the error of the specified field or field array.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 */
export function clearError<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName | TFieldArrayName
): void {
  setError(form, name, '');
}
