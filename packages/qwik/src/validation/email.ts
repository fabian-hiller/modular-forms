import { $, type QRL } from '@builder.io/qwik';

/**
 * Creates a validation functions that validates a email.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function email(
  error: string
): QRL<(value: string | null | undefined) => string> {
  return $((value: string | null | undefined) =>
    value &&
    !/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
      value
    )
      ? error
      : ''
  );
}
