import { ZodType } from 'zod';
import { FieldValue, Maybe } from '../types';

/**
 * Creates a validation functions that parses the Zod schema of a field.
 *
 * @param schema A Zod schema.
 *
 * @returns A validation function.
 */
export function zodField<TFieldValue extends FieldValue>(
  schema: ZodType<TFieldValue>
): (value: Maybe<TFieldValue>) => string {
  return (value: Maybe<TFieldValue>) => {
    const result = schema.safeParse(value);
    return result.success ? '' : result.error.issues[0].message;
  };
}
