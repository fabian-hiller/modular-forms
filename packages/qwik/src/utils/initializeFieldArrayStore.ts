import type {
  FieldArrayPath,
  FieldArrayStore,
  FieldValues,
  FormStore,
  ResponseData,
} from '../types';
import { getFieldArrayStore } from './getFieldArrayStore';
import { getInitialFieldArrayStore } from './getInitialFieldArrayStore';

/**
 * Initializes and returns the store of a field array.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param initialState The initial state.
 *
 * @returns The reactive store.
 */
export function initializeFieldArrayStore<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldArrayName
): FieldArrayStore<TFieldValues, TFieldArrayName> {
  if (!getFieldArrayStore(form, name)) {
    form.internal.fieldArrays[name] = getInitialFieldArrayStore(name);
  }
  return getFieldArrayStore(form, name) as FieldArrayStore<
    TFieldValues,
    TFieldArrayName
  >;
}
