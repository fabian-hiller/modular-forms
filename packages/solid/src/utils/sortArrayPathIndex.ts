import type { FieldArrayPath, FieldPath, FieldValues } from '../types/index.js';
import { getPathIndex } from '../utils';

/**
 * Returns a function that sorts field names by their array path index.
 *
 * @param name The name of the field array.
 *
 * @returns The sort function.
 */
export function sortArrayPathIndex<TFieldValues extends FieldValues>(
  name: FieldArrayPath<TFieldValues>
): (
  pathA: FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>,
  pathB: FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>
) => number {
  return (
    pathA: FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>,
    pathB: FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>
  ) => getPathIndex(name, pathA) - getPathIndex(name, pathB);
}
