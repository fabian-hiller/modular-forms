import type {
  FieldArrayPath,
  FieldValues,
  ReplaceOptions,
  ResponseData,
} from '@modular-forms/core';
import { replace as replaceMethod } from '@modular-forms/core';
import type { FormStore } from '../types';
import { initializeFieldArrayStore, initializeFieldStore } from '../utils';

/**
 * Replaces a item of the field array.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The replace options.
 */
export function replace<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldArrayName,
  options: ReplaceOptions<TFieldValues, TFieldArrayName>
): void {
  replaceMethod(
    { initializeFieldStore, initializeFieldArrayStore },
    form,
    name,
    options
  );
}
