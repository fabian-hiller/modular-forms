import type { SafeParseReturnType, ZodType } from 'zod';
import type { MaybeFunction, MaybeQRL } from '../types';

/**
 * Parses a value with a Zod scheme and returns the result.
 *
 * @param schema The Zod schema.
 * @param value The value.
 *
 * @returns The parse result.
 */
export async function getParsedZodSchema<Schema, Value>(
  schema: MaybeQRL<MaybeFunction<ZodType<any, any, Schema>>>,
  value: Value
): Promise<SafeParseReturnType<Schema, any>> {
  const zodSchema = 'resolve' in schema ? await schema.resolve() : schema;
  return (typeof zodSchema === 'function' ? zodSchema() : zodSchema).safeParse(
    value
  );
}
