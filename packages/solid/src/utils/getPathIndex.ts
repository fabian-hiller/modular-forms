import { FieldPath, FieldValues } from '../types';

/**
 * Returns the index of the path in the field array.
 *
 * @param name The field array name to get the index from.
 * @param path The path to get the index from.
 *
 * @returns The field index in the array.
 */
export function getPathIndex<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
>(name: string, path: TFieldName): number {
  return +path.replace(`${name}.`, '').split('.')[0];
}
