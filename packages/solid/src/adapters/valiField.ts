import type { BaseSchema, BaseSchemaAsync } from 'valibot';
import type { FieldValue, ValidateField, Maybe } from '../types/index.js';

/**
 * Creates a validation functions that parses the Valibot schema of a field.
 *
 * @param schema A Valibot schema.
 *
 * @returns A validation function.
 */
export function valiField<TFieldValue extends FieldValue>(
  schema: BaseSchema<TFieldValue, any> | BaseSchemaAsync<TFieldValue, any>
): ValidateField<TFieldValue> {
  return async (value: Maybe<TFieldValue>) => {
    const result = await schema._parse(value, { abortPipeEarly: true });
    return result.issues?.[0]?.message || '';
  };
}
