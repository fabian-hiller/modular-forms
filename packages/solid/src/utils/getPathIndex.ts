import type { FieldArrayPath, FieldPath, FieldValues } from '../types/index.js';

/**
 * Returns the index of the path in the field array.
 *
 * @param name The name of the field array.
 * @param path The path to get the index from.
 *
 * @returns The field index in the array.
 */
export function getPathIndex<TFieldValues extends FieldValues>(
  name: string,
  path: FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>
): number {
  return +path.replace(`${name}.`, '').split('.')[0];
}
