import { untrack } from 'solid-js';
import type {
  FieldArrayPath,
  FieldValues,
  FormStore,
  Maybe,
  RawFieldArrayState,
  ResponseData,
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
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: FieldArrayPath<TFieldValues>
): Maybe<RawFieldArrayState> {
  const fieldArray = getFieldArrayStore(form, name);
  return fieldArray
    ? untrack(() => ({
        startItems: fieldArray.getStartItems(),
        items: fieldArray.getItems(),
        error: fieldArray.getError(),
        touched: fieldArray.getTouched(),
        dirty: fieldArray.getDirty(),
      }))
    : undefined;
}
