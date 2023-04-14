import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  ResponseData,
  SwapOptions,
} from '@modular-forms/core';
import { swap as swapMethod } from '@modular-forms/core';
import type { FormStore } from '../types';
import { initializeFieldArrayStore, initializeFieldStore } from '../utils';

/**
 * Swaps two fields of a field array by their index.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The swap options.
 */
export function swap<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldArrayName,
  options: SwapOptions
): void {
  swapMethod(
    { initializeFieldStore, initializeFieldArrayStore },
    form,
    name,
    options
  );
}
