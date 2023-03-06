import { $, type QRL } from '@builder.io/qwik';

/**
 * Creates a validation functions that validates a URL.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function url(
  error: string
): QRL<(value: string | null | undefined) => string> {
  return $((value: string | null | undefined) => {
    try {
      value && new URL(value);
      return '';
    } catch (_) {
      return error;
    }
  });
}
