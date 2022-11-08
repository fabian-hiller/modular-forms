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
): (value: TFieldValue | number[]) => string {
  return (value: TFieldValue | number[]) =>
    !value ||
    ((value instanceof FileList || Array.isArray(value)) && !value.length)
      ? error
      : '';
}
