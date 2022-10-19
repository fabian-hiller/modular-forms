import { FieldValue } from '../types';

/**
 * Creates a custom validation function.
 *
 * @param requirement The validation function.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function custom<TFieldValue extends FieldValue>(
  requirement: (value: TFieldValue | undefined) => boolean | Promise<boolean>,
  error: string
): (fieldValue: TFieldValue) => Promise<string> {
  return async (fieldValue: TFieldValue) => {
    const result = await requirement(fieldValue);
    return !result ? error : '';
  };
}
