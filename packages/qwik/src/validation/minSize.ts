import { $, type NoSerialize, type QRL } from '@builder.io/qwik';

type Value =
  | NoSerialize<Blob>
  | NoSerialize<Blob[]>
  | NoSerialize<File>
  | NoSerialize<File[]>
  | null
  | undefined;

/**
 * Creates a validation functions that validates the file size.
 *
 * @param requirement The minimum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minSize(
  requirement: number,
  error: string
): QRL<(value: Value) => string> {
  return $((value: Value) =>
    value &&
    (Array.isArray(value)
      ? [...value].some((file) => file.size < requirement)
      : value.size < requirement)
      ? error
      : ''
  );
}
