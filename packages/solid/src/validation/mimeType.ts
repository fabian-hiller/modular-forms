import type { MaybeValue } from '../types/index.js';

type Value = MaybeValue<File | File[]>;

/**
 * Creates a validation functions that validates the file type.
 *
 * @param requirement The MIME types.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function mimeType(
  requirement: string | string[],
  error: string
): (value: Value) => string {
  const mimeTypes = Array.isArray(requirement) ? requirement : [requirement];
  return (value: Value) =>
    value &&
    (Array.isArray(value)
      ? [...value].some((file) => !mimeTypes.includes(file.type))
      : !mimeTypes.includes(value.type))
      ? error
      : '';
}
