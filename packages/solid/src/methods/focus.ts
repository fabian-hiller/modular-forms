import { untrack } from 'solid-js';
import { FieldPath, FieldValues, FormState } from '../types';

/**
 * Focuses the specified field of the form.
 *
 * @param form The form that contains the field.
 * @param name The name of the field to focus on.
 */
export function focus<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
>(form: FormState<TFieldValues>, name: TFieldName): void {
  untrack(() => form.internal.fields.get(name)?.getElements()[0]?.focus());
}
