import {
  FieldArrayPath,
  FieldPath,
  FieldPathValue,
  FieldValues,
  Maybe,
  ResponseData,
} from '@modular-forms/shared';
import { FieldValue, FormStore } from '../types';
import { getPathValue } from './getPathValue';

/**
 * Returns the initial value of a field.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 *
 * @returns Initial field value.
 */
export function getInitialFieldValue<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName
): Maybe<FieldPathValue<TFieldValues, TFieldName, FieldValue>> {
  return getPathValue(name, form.internal.initialValues);
}
