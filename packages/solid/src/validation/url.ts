import type { MaybeValue } from '../types/index.js';

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
      value && new URL(value);
      return '';
    } catch (_) {
      return error;
    }
  };
}
