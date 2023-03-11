import { $, type QRL } from '@builder.io/qwik';

type Value = string | null | undefined;

/**
 * Creates a validation functions that validates a URL.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function url(error: string): QRL<(value: Value) => string> {
  return $((value: Value) => {
    try {
      value && new URL(value);
      return '';
    } catch (_) {
      return error;
    }
  });
}
