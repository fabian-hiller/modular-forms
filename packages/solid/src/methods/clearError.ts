import { FieldArrayPath, FieldPath, FieldValues } from '@modular-forms/shared';
import { FieldValue, FormState } from '../types';
import { setError } from './setError';

/**
 * Clears the error of the specified field or field array.
 *
 * @param form The form that contains the field.
 * @param name The name of the field where the error should be cleared.
 */
export function clearError<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(form: FormState<TFieldValues>, name: TFieldName | TFieldArrayName): void {
  setError(form, name, '');
}
