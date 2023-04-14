import type { MaybeNoSerialize, MaybeValue } from '../types';

type Value = MaybeValue<
  | MaybeNoSerialize<Blob>
  | MaybeNoSerialize<Blob[]>
  | MaybeNoSerialize<File>
  | MaybeNoSerialize<File[]>
>;

/**
 * Creates a validation functions that validates the file type.
 *
 * @param requirement The maximum size.
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
