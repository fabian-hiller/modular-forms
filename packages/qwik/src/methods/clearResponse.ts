import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
} from '../types';

/**
 * Clears the response of the form.
 *
 * @param form The form of the response.
 */
export function clearResponse<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(form: FormStore<TFieldValues, TFieldName, TFieldArrayName>): void {
  form.response = {};
}
