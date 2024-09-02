import type { QRL } from '@builder.io/qwik';
import type { SafeParseReturnType, ZodType } from 'zod';
import type { MaybeFunction } from '../types';

/**
 * Parses a value with a Zod schema and returns the result.
 *
 * @param schema The Zod schema.
 * @param value The value.
 *
 * @returns The parse result.
 */
export async function getParsedZodSchema<Schema, Value>(
  schema: QRL<MaybeFunction<ZodType<any, any, Schema>>>,
  value: Value
): Promise<SafeParseReturnType<Schema, any>> {
  const zodSchema = await schema.resolve();
  return (
    typeof zodSchema === 'function' ? zodSchema() : zodSchema
  ).safeParseAsync(value);
}
