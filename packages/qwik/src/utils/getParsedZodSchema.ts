import type { QRL } from '@builder.io/qwik';
import type { MaybeFunction } from '@modular-forms/shared';
import type { SafeParseReturnType, ZodType } from 'zod';

/**
 * Parses a value with a Zod scheme and returns the result.
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
  const qrlValue = await schema.resolve();
  return (typeof qrlValue === 'function' ? qrlValue() : qrlValue).safeParse(
    value
  );
}
