import { $, type QRL } from '@builder.io/qwik';

type Value = string | number | null | undefined;

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
): QRL<(value: Value) => string> {
  return $((value: Value) =>
    (value || value === 0) && value !== requirement ? error : ''
  );
}
