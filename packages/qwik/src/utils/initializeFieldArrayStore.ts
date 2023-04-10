import type { ResponseData } from '@modular-forms/shared';
import type {
  FieldArrayPath,
  FieldArrayStore,
  FieldPath,
  FieldValues,
  FormStore,
  InitialFieldArrayState,
} from '../types';
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
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldArrayName,
  initialState: InitialFieldArrayState
): FieldArrayStore<TFieldValues, TFieldArrayName> {
  if (!form.internal.fieldArrays[name]) {
    form.internal.fieldArrays[name] = getInitialFieldArrayStore(
      name,
      initialState
    );
  }
  return form.internal.fieldArrays[name];
}
