import { untrack } from 'solid-js';
import type { FieldValues, FormStore, ResponseData } from '../types/index.js';

/**
 * Validates and submits the form.
 *
 * @param form The form to be submitted.
 */
export function submit<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(form: FormStore<TFieldValues, TResponseData>): void {
  untrack(() => form.element)?.requestSubmit();
}
