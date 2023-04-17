import { untrack } from 'solid-js';
import type {
  FieldPath,
  FieldValues,
  FormStore,
  Maybe,
  RawFieldState,
  ResponseData,
} from '../types';
import { getFieldStore } from './getFieldStore';

/**
 * Returns the RAW state of the field.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 *
 * @returns The state of the field.
 */
export function getFieldState<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldName
): Maybe<RawFieldState<TFieldValues, TFieldName>> {
  const field = getFieldStore(form, name);
  return field
    ? untrack(() => ({
        startValue: field.getStartValue(),
        value: field.getValue(),
        error: field.getError(),
        touched: field.getTouched(),
        dirty: field.getDirty(),
      }))
    : undefined;
}
