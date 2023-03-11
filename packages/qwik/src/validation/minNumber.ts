import { $, type QRL } from '@builder.io/qwik';

type Value = number | null | undefined;

/**
 * Creates a validation functions that validates a number.
 *
 * @param requirement The minimum number.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minNumber(
  requirement: number,
  error: string
): QRL<(value: Value) => string> {
  return $((value: Value) =>
    (value || value === 0) && value < requirement ? error : ''
  );
}
