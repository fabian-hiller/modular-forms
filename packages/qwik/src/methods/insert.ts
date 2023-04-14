import type {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldValues,
  FormStore,
  InsertOptions,
  ResponseData,
} from '@modular-forms/shared';
import { insert as insertMethod } from '@modular-forms/shared';
import { initializeFieldArrayStore, initializeFieldStore } from '../utils';

/**
 * Inserts a new item into the field array.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The insert options.
 */
export function insert<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TFieldArrayValues extends FieldArrayPathValue<TFieldValues, TFieldArrayName>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldArrayName,
  options: InsertOptions<TFieldValues, TFieldArrayName, TFieldArrayValues>
): void {
  insertMethod(
    {
      initializeFieldStore,
      initializeFieldArrayStore,
    },
    form,
    name,
    options
  );
}
