import { FieldValues } from '@modular-forms/shared';
import { FieldArrayPath, FieldValue, FormState } from '../types';
import { getPathValue } from './getPathValue';
import { getUniqueId } from './getUniqueId';

/**
 * Returns the initial items of the form field array.
 *
 * @param form The form that contains the field array.
 * @param name The name of the field array.
 *
 * @returns Initial field array items.
 */
export function getInitialItems<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(form: FormState<TFieldValues>, name: TFieldArrayName): number[] {
  return (getPathValue(name, form.internal.initialValues) || []).map(() =>
    getUniqueId()
  );
}
