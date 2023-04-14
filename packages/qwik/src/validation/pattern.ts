import { $, type QRL } from '@builder.io/qwik';
import type { MaybeValue } from '@modular-forms/core';
import { pattern as validate } from '@modular-forms/core';

type Value = MaybeValue<string>;

/**
 * Creates a validation functions that validates the pattern of a string.
 *
 * @param requirement The regex pattern.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function pattern(
  requirement: RegExp,
  error: string
): QRL<(value: Value) => string> {
  return $((value: Value) => validate(requirement, error)(value));
}
