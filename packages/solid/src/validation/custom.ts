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
): (value: TFieldValue) => Promise<string> {
  return async (value: TFieldValue) =>
    (value instanceof FileList || Array.isArray(value)
      ? value.length
      : value || value === 0) && !(await requirement(value))
      ? error
      : '';
}
