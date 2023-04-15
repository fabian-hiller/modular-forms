import type {
  FieldArrayPath,
  FieldValues,
  ResponseData,
  SwapOptions,
} from '@modular-forms/core';
import { swap as swapMethod } from '@modular-forms/core';
import { batch, untrack } from 'solid-js';
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
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: FieldArrayPath<TFieldValues>,
  options: SwapOptions
): void {
  batch(() =>
    untrack(() =>
      swapMethod(
        { initializeFieldStore, initializeFieldArrayStore },
        form,
        name,
        options
      )
    )
  );
}
