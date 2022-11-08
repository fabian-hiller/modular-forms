import { FieldValue } from '../types';

/**
 * Creates a validation function that checks the existence of an input.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function required<TFieldValue extends FieldValue>(
  error: string
): (value: TFieldValue) => string {
  return (value: TFieldValue) =>
    (value instanceof FileList && !value.length) || !value ? error : '';
}
