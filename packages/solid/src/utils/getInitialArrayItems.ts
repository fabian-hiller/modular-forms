import {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  ResponseData,
} from '@modular-forms/shared';
import { FieldValue, FormStore } from '../types';
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
export function getInitialArrayItems<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldArrayName
): number[] {
  return (getPathValue(name, form.internal.initialValues) || []).map(() =>
    getUniqueId()
  );
}
