import type {
  FieldArrayPath,
  FieldPath,
  FieldPathValue,
  FieldValues,
  FormStore,
  ResponseData,
  ValueOptions,
} from '@modular-forms/shared';
import { setValue as setValueMethod } from '@modular-forms/shared';
import { initializeFieldStore } from '../utils';

/**
 * Sets the value of the specified field.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 * @param value The value to bet set.
 * @param options The value options.
 */
export function setValue<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName,
  value: FieldPathValue<TFieldValues, TFieldName>,
  options: ValueOptions
): void {
  setValueMethod(initializeFieldStore, form, name, value, options);
}
