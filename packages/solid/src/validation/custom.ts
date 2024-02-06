import type { FieldValue, Maybe, MaybePromise } from '../types/index.js';

/**
 * Creates a custom validation function.
 *
 * @param requirement The validation function.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function custom<TFieldValue extends FieldValue>(
  requirement: (value: Maybe<TFieldValue>) => MaybePromise<boolean>,
  error: string
): (value: Maybe<TFieldValue>) => Promise<string> {
  return async (value: Maybe<TFieldValue>) =>
    (Array.isArray(value) ? value.length : value || value === 0) &&
    !(await requirement(value))
      ? error
      : '';
}
