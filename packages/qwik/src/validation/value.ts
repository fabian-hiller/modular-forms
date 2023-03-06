import { $, type QRL } from '@builder.io/qwik';

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
): QRL<(value: string | number | null | undefined) => string> {
  return $((value: string | number | null | undefined) =>
    (value || value === 0) && value !== requirement ? error : ''
  );
}
