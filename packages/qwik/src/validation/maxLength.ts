import { $, type QRL } from '@builder.io/qwik';

/**
 * Creates a validation functions that validates the length of a string or array.
 *
 * @param requirement The maximum string or array length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxLength(
  requirement: number,
  error: string
): QRL<(value: string | string[] | number[] | null | undefined) => string> {
  return $((value: string | string[] | number[] | null | undefined) =>
    value?.length && value.length > requirement ? error : ''
  );
}
