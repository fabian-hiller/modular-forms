import type { MaybeValue } from '../types';

type Value = MaybeValue<string>;

/**
 * Creates a validation functions that validates a URL.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function url(error: string): (value: Value) => string {
  return (value: Value) => {
    try {
      new URL(value);
      return '';
    } catch {
      return error;
    }
  };
}
