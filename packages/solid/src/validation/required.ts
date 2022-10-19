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
): (fieldValue: TFieldValue) => string {
  return (fieldValue: TFieldValue) =>
    (fieldValue instanceof FileList && !fieldValue.length) || !fieldValue
      ? error
      : '';
}
