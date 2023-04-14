import { $, implicit$FirstArg, type QRL } from '@builder.io/qwik';
import type {
  FieldValue,
  Maybe,
  MaybeFunction,
  ValidateField,
} from '@modular-forms/core';
import { zodField } from '@modular-forms/core';
import type { ZodType } from 'zod';

/**
 * See {@link zodField$}
 */
export function zodFieldQrl<TFieldValue extends FieldValue>(
  schema: QRL<MaybeFunction<ZodType<any, any, TFieldValue>>>
): QRL<ValidateField<TFieldValue>> {
  return $((value: Maybe<TFieldValue>) => zodField(schema)(value));
}

/**
 * Creates a validation functions that parses the Zod schema of a field.
 *
 * @param schema A Zod schema.
 *
 * @returns A validation function.
 */
export const zodField$ = implicit$FirstArg(zodFieldQrl);
