import { $, type NoSerialize, type QRL } from '@builder.io/qwik';

type Value =
  | NoSerialize<Blob>
  | NoSerialize<Blob[]>
  | NoSerialize<File>
  | NoSerialize<File[]>
  | null
  | undefined;

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
): QRL<(value: Value) => string> {
  const mimeTypes = Array.isArray(requirement) ? requirement : [requirement];
  return $((value: Value) =>
    value &&
    (Array.isArray(value)
      ? [...value].some((file) => !mimeTypes.includes(file.type))
      : !mimeTypes.includes(value.type))
      ? error
      : ''
  );
}
