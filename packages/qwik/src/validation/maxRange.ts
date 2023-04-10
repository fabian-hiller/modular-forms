import { $, type QRL } from '@builder.io/qwik';
import type { MaybeValue } from '@modular-forms/shared';

type Value = MaybeValue<string | number | Date>;

/**
 * Creates a validation functions that validates the range of a string, number or date.
 *
 * @param requirement The maximum range.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxRange(
  requirement: string | number | Date,
  error: string
): QRL<(value: Value) => string> {
  return $((value: Value) =>
    (value || value === 0) && value! > requirement ? error : ''
  );
}
