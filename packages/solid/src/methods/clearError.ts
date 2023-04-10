import { FieldValues } from '@modular-forms/shared';
import { FieldArrayPath, FieldPath, FieldValue, FormState } from '../types';
import { setError } from './setError';

/**
 * Clears the error of the specified field or field array.
 *
 * @param form The form that contains the field.
 * @param name The name of the field where the error should be cleared.
 */
export function clearError<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(form: FormState<TFieldValues>, name: TFieldName | TFieldArrayName): void {
  setError(form, name, '');
}
