import { Maybe } from '@modular-forms/shared';
import { FieldPath, FieldPathValue, FieldValues, FormState } from '../types';
import { getPathValue } from './getPathValue';

/**
 * Returns the initial value of the form field.
 *
 * @param form The form that contains the field.
 * @param name The name of the field.
 *
 * @returns Initial field value.
 */
export function getInitialValue<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  name: TFieldName
): Maybe<FieldPathValue<TFieldValues, TFieldName>> {
  return getPathValue(name, form.internal.initialValues);
}
