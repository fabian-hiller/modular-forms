import type {
  FieldArrayPath,
  FieldValues,
  InsertOptions,
  ResponseData,
} from '@modular-forms/core';
import { insert as insertMethod } from '@modular-forms/core';
import type { FormStore } from '../types';
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
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldArrayName,
  options: InsertOptions<TFieldValues, TFieldArrayName>
): void {
  insertMethod(
    { initializeFieldStore, initializeFieldArrayStore },
    form,
    name,
    options
  );
}
