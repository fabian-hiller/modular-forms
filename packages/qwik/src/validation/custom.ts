import { $, type QRL } from '@builder.io/qwik';
import type { FieldValue, Maybe } from '../types';

/**
 * Creates a custom validation function.
 *
 * @param requirement The validation function.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function custom<TFieldValue extends FieldValue>(
  requirement: QRL<(value: Maybe<TFieldValue>) => boolean | Promise<boolean>>,
  error: string
): QRL<(value: Maybe<TFieldValue>) => Promise<string>> {
  return $(async (value: Maybe<TFieldValue>) =>
    (value instanceof FileList || Array.isArray(value)
      ? value.length
      : value || value === 0) && !(await requirement(value))
      ? error
      : ''
  );
}
