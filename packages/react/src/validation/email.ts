import type { MaybeValue } from '../types';

type Value = MaybeValue<string>;

/**
 * Creates a validation functions that validates a email.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function email(error: string): (value: Value) => string {
  return (value: Value) =>
    value &&
    !/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
      value
    )
      ? error
      : '';
}
