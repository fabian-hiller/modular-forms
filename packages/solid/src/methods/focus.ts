import { untrack } from 'solid-js';
import type { FieldPath, FieldValues, ResponseData } from '@modular-forms/core';
import { focus as focusMethod } from '@modular-forms/core';
import type { FormStore } from '../types';

/**
 * Focuses the specified field of the form.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 */
export function focus<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: FieldPath<TFieldValues>
): void {
  untrack(() => focusMethod(form, name));
}
