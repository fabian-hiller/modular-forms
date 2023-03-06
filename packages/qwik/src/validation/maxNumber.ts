import { $, type QRL } from '@builder.io/qwik';

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
): QRL<(value: number | null | undefined) => string> {
  return $((value: number | null | undefined) =>
    (value || value === 0) && value > requirement ? error : ''
  );
}
