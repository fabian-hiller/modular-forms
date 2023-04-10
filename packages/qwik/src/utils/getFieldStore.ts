import type { ResponseData } from '@modular-forms/shared';
import type {
  FieldArrayPath,
  FieldPath,
  FieldStore,
  FieldValues,
  FormStore,
} from '../types';

/**
 * Returns the store of a field.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 *
 * @returns The reactive store.
 */
export function getFieldStore<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName
): FieldStore<TFieldValues, TFieldName> {
  return form.internal.fields[name];
}
