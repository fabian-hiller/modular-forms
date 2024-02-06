import type { MaybeValue } from '../types/index.js';

type Value = MaybeValue<File | File[]>;

/**
 * Creates a validation functions that validates the file size.
 *
 * @param requirement The maximum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxSize(
  requirement: number,
  error: string
): (value: Value) => string {
  return (value: Value) =>
    value &&
    (Array.isArray(value)
      ? [...value].some((file) => file.size > requirement)
      : value.size > requirement)
      ? error
      : '';
}
