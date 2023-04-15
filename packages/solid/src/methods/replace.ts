import type {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldValues,
  ReplaceOptions,
  ResponseData,
} from '@modular-forms/core';
import { replace as replaceMethod } from '@modular-forms/core';
import { batch, untrack } from 'solid-js';
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
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TFieldArrayValues extends FieldArrayPathValue<TFieldValues, TFieldArrayName>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldArrayName,
  options: ReplaceOptions<TFieldValues, TFieldArrayName, TFieldArrayValues>
): void {
  batch(() =>
    untrack(() =>
      replaceMethod(
        { initializeFieldStore, initializeFieldArrayStore },
        form,
        name,
        options
      )
    )
  );
}
