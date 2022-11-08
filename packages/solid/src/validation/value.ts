import { FieldValue } from '../types';

/**
 * Creates a validation function that checks the value of an input for equality.
 *
 * @param requirement The value to be checked.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function value<TFieldValue extends FieldValue>(
  requirement: FieldValue,
  error: string
): (value: TFieldValue) => string {
  return (value: TFieldValue) => (value !== requirement ? error : '');
}
