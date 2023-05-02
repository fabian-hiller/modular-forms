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
    ? {
        startItems: fieldArray.startItems.peek(),
        items: fieldArray.items.peek(),
        error: fieldArray.error.peek(),
        touched: fieldArray.touched.peek(),
        dirty: fieldArray.dirty.peek(),
      }
    : undefined;
}
