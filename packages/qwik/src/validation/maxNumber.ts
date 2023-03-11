import { $, type QRL } from '@builder.io/qwik';

type Value = number | null | undefined;

/**
 * Creates a validation functions that validates a number.
 *
 * @param requirement The maximum number.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxNumber(
  requirement: number,
  error: string
): QRL<(value: Value) => string> {
  return $((value: Value) =>
    (value || value === 0) && value > requirement ? error : ''
  );
}
