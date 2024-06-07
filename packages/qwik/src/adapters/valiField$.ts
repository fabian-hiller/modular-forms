import { $, implicit$FirstArg, type QRL } from '@builder.io/qwik';
import {
  type GenericSchema,
  type GenericSchemaAsync,
  safeParseAsync,
} from 'valibot';
import type { FieldValue, MaybeFunction, ValidateField, Maybe } from '../types';

/**
 * See {@link valiField$}
 */
export function valiFieldQrl<TFieldValue extends FieldValue>(
  schema: QRL<MaybeFunction<GenericSchema | GenericSchemaAsync>>
): QRL<ValidateField<TFieldValue>> {
  return $(async (value: Maybe<TFieldValue>) => {
    const resolvedSchema = await schema.resolve();
    const result = await safeParseAsync(
      typeof resolvedSchema === 'function' ? resolvedSchema() : resolvedSchema,
      value,
      { abortPipeEarly: true }
    );
    return result.issues?.[0].message || '';
  });
}

/**
 * Creates a validation functions that parses the Valibot schema of a field.
 *
 * @param schema A Valibot schema.
 *
 * @returns A validation function.
 */
export const valiField$ = implicit$FirstArg(valiFieldQrl);
