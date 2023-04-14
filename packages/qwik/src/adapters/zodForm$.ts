import { $, implicit$FirstArg, type QRL } from '@builder.io/qwik';
import type {
  FieldValues,
  MaybeFunction,
  PartialValues,
  ValidateForm,
} from '@modular-forms/core';
import { zodForm } from '@modular-forms/core';
import type { ZodType } from 'zod';

/**
 * See {@link zodForm$}
 */
export function zodFormQrl<TFieldValues extends FieldValues>(
  schema: QRL<MaybeFunction<ZodType<any, any, TFieldValues>>>
): QRL<ValidateForm<TFieldValues>> {
  return $((values: PartialValues<TFieldValues>) => zodForm(schema)(values));
}

/**
 * Creates a validation functions that parses the Zod schema of a form.
 *
 * @param schema A Zod schema.
 *
 * @returns A validation function.
 */
export const zodForm$ = implicit$FirstArg(zodFormQrl);
