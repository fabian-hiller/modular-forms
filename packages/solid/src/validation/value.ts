import type { MaybeValue } from '../types/index.js';

type Value = MaybeValue<string | number>;

/**
 * Creates a validation function that checks the value of an input for equality.
 *
 * @param requirement The value to be checked.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function value(
  requirement: string | number,
  error: string
): (value: Value) => string {
  return (value: Value) =>
    (value || value === 0) && value !== requirement ? error : '';
}
