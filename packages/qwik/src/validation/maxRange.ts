import { $, type QRL } from '@builder.io/qwik';

type Value = string | Date | null | undefined;

/**
 * Creates a validation functions that validates the range of a string or date.
 *
 * @param requirement The maximum range.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxRange(
  requirement: string | Date,
  error: string
): QRL<(value: Value) => string> {
  return $((value: Value) => (value && value > requirement ? error : ''));
}
