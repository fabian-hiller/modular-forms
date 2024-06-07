import {
  type GenericSchema,
  type GenericSchemaAsync,
  safeParseAsync,
} from 'valibot';
import type { FieldValue, ValidateField, Maybe } from '../types';

/**
 * Creates a validation functions that parses the Valibot schema of a field.
 *
 * @param schema A Valibot schema.
 *
 * @returns A validation function.
 */
export function valiField<TFieldValue extends FieldValue>(
  schema: GenericSchema | GenericSchemaAsync
): ValidateField<TFieldValue> {
  return async (value: Maybe<TFieldValue>) => {
    const result = await safeParseAsync(schema, value, {
      abortPipeEarly: true,
    });
    return result.issues?.[0]?.message || '';
  };
}
