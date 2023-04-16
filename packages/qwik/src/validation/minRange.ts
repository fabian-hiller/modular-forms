import { $, type QRL } from '@builder.io/qwik';
import type { MaybeValue } from '../types';

type Value = MaybeValue<string | number | Date>;

/**
 * Creates a validation functions that validates the range of a string, number or date.
 *
 * @param requirement The minimum range.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minRange(
  requirement: string | number | Date,
  error: string
): QRL<(value: Value) => string> {
  return $((value: Value) =>
    (value || value === 0) && value < requirement ? error : ''
  );
}
