import { untrack } from 'solid-js';
import type {
  FieldValues,
  ResponseData,
  FieldArrayPath,
  FormStore,
  Maybe,
} from '../types/index.js';
import { removeInvalidNames } from './removeInvalidNames';

/**
 * Returns a list with the names of all field arrays.
 *
 * @param form The form of the field arrays.
 * @param shouldValid Whether to be valid.
 *
 * @returns All field array names of the form.
 */
export function getFieldArrayNames<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  shouldValid: Maybe<boolean> = true
): FieldArrayPath<TFieldValues>[] {
  // Get name of every field array
  const fieldArrayNames = [...untrack(form.internal.fieldArrayNames.get)];

  // Remove invalid field array names
  if (shouldValid) {
    removeInvalidNames(form, fieldArrayNames);
  }

  // Return field array names
  return fieldArrayNames;
}
