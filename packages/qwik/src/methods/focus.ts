import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  ResponseData,
} from '@modular-forms/shared';
import type { FieldValue, FormStore } from '../types';
import { getFieldStore } from '../utils';

/**
 * Focuses the specified field of the form.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 */
export function focus<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName
): void {
  getFieldStore(form, name).internal.elements[0]?.focus();
}
