import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  MoveOptions,
  ResponseData,
} from '@modular-forms/core';
import { move as moveMethod } from '@modular-forms/core';
import { batch, untrack } from 'solid-js';
import type { FormStore } from '../types';
import { initializeFieldArrayStore, initializeFieldStore } from '../utils';

/**
 * Moves a field of the field array to a new position and rearranges all fields
 * in between.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The move options.
 */
export function move<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldArrayName,
  options: MoveOptions
): void {
  batch(() =>
    untrack(() =>
      moveMethod(
        { initializeFieldStore, initializeFieldArrayStore },
        form,
        name,
        options
      )
    )
  );
}
