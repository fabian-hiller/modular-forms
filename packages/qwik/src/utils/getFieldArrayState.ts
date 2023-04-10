import type {
  FieldValues,
  RawFieldArrayState,
  ResponseData,
} from '@modular-forms/shared';
import type {
  FieldArrayPath,
  FieldPath,
  FieldValue,
  FormStore,
} from '../types';
import { getFieldArrayStore } from './getFieldArrayStore';

/**
 * Returns the RAW state of the field array.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 *
 * @returns The state of the field array.
 */
export function getFieldArrayState<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldArrayName
): RawFieldArrayState {
  const {
    internal: { startItems },
    items,
    error,
    touched,
    dirty,
  } = getFieldArrayStore(form, name);
  return {
    startItems,
    items,
    error,
    touched,
    dirty,
  };
}
