import { FieldPath, FieldValues } from '@modular-forms/shared';
import { FieldValue } from '../types';

/**
 * Returns the index of the path in the field array.
 *
 * @param name The field array name to get the index from.
 * @param path The path to get the index from.
 *
 * @returns The field index in the array.
 */
export function getPathIndex<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues, FieldValue>
>(name: string, path: TFieldName): number {
  return +path.replace(`${name}.`, '').split('.')[0];
}
