import type { MaybeValue } from '../types/index.js';

type Value = MaybeValue<string>;

/**
 * Creates a validation functions that validates the pattern of a string.
 *
 * @param requirement The regex pattern.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function pattern(
  requirement: RegExp,
  error: string
): (value: Value) => string {
  return (value: Value) => (value && !requirement.test(value) ? error : '');
}
