import type { MaybeValue } from '../types/index.js';

type Value = MaybeValue<string | string[] | number[] | File[]>;

/**
 * Creates a validation functions that validates the length of a string or array.
 *
 * @param requirement The minimum string or array length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minLength(
  requirement: number,
  error: string
): (value: Value) => string {
  return (value: Value) =>
    value?.length && value.length < requirement ? error : '';
}
