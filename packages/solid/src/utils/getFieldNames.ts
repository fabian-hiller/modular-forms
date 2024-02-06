import { untrack } from 'solid-js';
import type {
  FieldPath,
  FieldValues,
  FormStore,
  Maybe,
  ResponseData,
} from '../types/index.js';
import { removeInvalidNames } from './removeInvalidNames';

/**
 * Returns a list with the names of all fields.
 *
 * @param form The form of the fields.
 * @param shouldValid Whether to be valid.
 *
 * @returns All field names of the form.
 */
export function getFieldNames<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  shouldValid: Maybe<boolean> = true
): FieldPath<TFieldValues>[] {
  // Get name of every field
  const fieldNames = [...untrack(form.internal.fieldNames.get)];

  // Remove invalid field names
  if (shouldValid) {
    removeInvalidNames(form, fieldNames);
  }

  // Return field names
  return fieldNames;
}
