import { $, type QRL } from '@builder.io/qwik';

type Value = string | string[] | number[] | null | undefined;

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
): QRL<(value: Value) => string> {
  return $((value: Value) =>
    value?.length && value.length < requirement ? error : ''
  );
}
