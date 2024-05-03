import type { ZodType } from 'zod';
import type { FieldValue, ValidateField, Maybe } from '../types/index.js';

/**
 * Creates a validation functions that parses the Zod schema of a field.
 *
 * @param schema A Zod schema.
 *
 * @returns A validation function.
 */
export function zodField<TFieldValue extends FieldValue>(
  schema: ZodType<any, any, TFieldValue>
): ValidateField<TFieldValue> {
  return (value: Maybe<TFieldValue>) => {
    const result = schema.safeParse(value);
    return result.success ? '' : result.error.issues[0].message;
  };
}
